/* Landing-page background, variation: Blue Sapphire alone.

   The Blue Sapphire painting fills the screen, straight on. Its navy, white and
   gold marbling flows along the direction of its own veins (the flow follows the
   painting's surface structure, steered by a gentle curl field), while the deep
   blue crystal mass is detected by colour and held almost still, so it stays
   crisp and drifts only with the canvas. A slowly circling light catches the gold
   veins and the faceted crystals. The view breathes and drifts very slightly.
   Every motion is periodic: a seamless 90-second loop that opens on the same frame. */
(function () {
  const IMG = "images/flow/sapphire-full.jpg?v=13";
  const LOOP = 90;

  const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`;

  const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_loop;
uniform sampler2D u_img; uniform float u_imgAR; uniform vec2 u_texel;
const float TAU = 6.2831853;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.03+17.1; a*=.5; } return v; }
vec2 curl(vec2 p, vec2 o){
  float e = .05;
  float n1 = fbm(p+vec2(0.,e)+o), n2 = fbm(p-vec2(0.,e)+o);
  float n3 = fbm(p+vec2(e,0.)+o), n4 = fbm(p-vec2(e,0.)+o);
  return vec2(n1-n2, n4-n3) / (2.*e);
}
vec3 tex(vec2 uv){ return texture2D(u_img, clamp(uv, u_texel, 1. - u_texel)).rgb; }
float lum(vec3 c){ return dot(c, vec3(.299, .587, .114)); }

void main(){
  float ang = TAU * u_time / u_loop;
  vec2 ring = vec2(cos(ang), sin(ang));

  // straight-on cover fit, with a little room for a slow drift and breath
  vec2 sp = gl_FragCoord.xy / u_res; sp.y = 1. - sp.y;
  float s = u_res.x / u_res.y, a = u_imgAR;
  vec2 c0 = (sp - .5) * (s > a ? vec2(1., a / s) : vec2(s / a, 1.));
  float zoom = 1.2 + .02 * sin(ang * 2.);
  vec2 pan = vec2(.045 * ring.x, .035 * sin(ang * 2. + .7));
  vec2 q = c0 / zoom + .5 + pan;

  vec3 base = tex(q);
  float L = lum(base);

  // crystal mass: deep, saturated blue. Gold veins: warm and bright.
  float crystal = smoothstep(.10, .26, base.b - max(base.r, base.g)) * smoothstep(.55, .25, L);
  float gold = smoothstep(.06, .22, base.r - base.b) * smoothstep(.25, .55, L);

  // flow direction: along the painting's own veins (perpendicular to its
  // brightness gradient, measured at a coarse scale), steered by a curl field
  vec2 dx = vec2(u_texel.x * 9., 0.), dy = vec2(0., u_texel.y * 9.);
  vec2 g = vec2(lum(tex(q + dx)) - lum(tex(q - dx)), lum(tex(q + dy)) - lum(tex(q - dy)));
  vec2 vein = vec2(-g.y, g.x);
  vec2 cu = curl(q * 3.2, .22 * ring);
  float vl = length(vein);
  vein = vl > 1e-4 ? vein / vl : vec2(0.);
  if (dot(vein, cu) < 0.) vein = -vein;
  vec2 dir = mix(cu * .6, vein * length(cu) * .6, smoothstep(.01, .08, vl) * .65);
  vec2 f = dir * .016 * (1. - .92 * crystal) * vec2(1., a);

  // two-phase advection: the paint keeps moving without ever tearing
  float cyc = 6. * u_time / u_loop;
  float ph0 = fract(cyc), ph1 = fract(cyc + .5);
  float bl = abs(ph0 * 2. - 1.);
  vec3 col = mix(tex(q - f * ph0), tex(q - f * ph1), bl);

  // glossy paint and faceted crystal: relief from the photograph's own detail
  vec2 ex = vec2(u_texel.x * 1.5, 0.), ey = vec2(0., u_texel.y * 1.5);
  float l0 = lum(col);
  vec3 n = normalize(vec3((lum(tex(q - f*ph0 + ex)) - lum(tex(q - f*ph0 - ex))) * 6.,
                          (lum(tex(q - f*ph0 + ey)) - lum(tex(q - f*ph0 - ey))) * 6., 1.));
  vec3 Ld = normalize(vec3(.6 * ring.x, .6 * ring.y - .25, .75));
  vec3 H = normalize(Ld + vec3(0., 0., 1.));
  float spec = pow(max(dot(n, H), 0.), 48.);
  col += spec * (.06 + .30 * gold + .28 * crystal) * vec3(1., .96, .9);

  // a soft, slow swell of light across the surface, like a tilt toward a window
  float sheen = smoothstep(.0, 1., fbm(q * 1.6 + .25 * ring)) - .5;
  col *= 1. + .07 * sheen;

  vec2 v = sp - .5;
  col *= 1. - .22 * dot(v, v);
  gl_FragColor = vec4(col, 1.);
}`;

  window.FlowSapphire = function (canvas) {
    const api = { playing: false, ready: false, play() {}, pause() {}, seek() {}, onready: null };
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return api;

    function sh(type, src) {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { console.warn("Sapphire shader unavailable:", e); return api; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = n => gl.getUniformLocation(prog, n);
    const uRes = U("u_res"), uTime = U("u_time");
    gl.uniform1f(U("u_loop"), LOOP);

    let t0 = performance.now(), offset = 0, raf = 0, last = 0;
    function size() {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.9;
      const w = Math.max(2, Math.round(canvas.clientWidth * scale));
      const h = Math.max(2, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    }
    function draw(time) {
      size();
      gl.uniform1f(uTime, ((time % LOOP) + LOOP) % LOOP);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (now - last < 30) return;
      last = now;
      draw(offset + (now - t0) / 1000);
    }
    api.play = () => {
      if (!api.ready || api.playing) return;
      api.playing = true; t0 = performance.now(); raf = requestAnimationFrame(frame);
    };
    api.pause = () => {
      if (!api.playing) return;
      api.playing = false; cancelAnimationFrame(raf);
      offset += (performance.now() - t0) / 1000;
    };
    api.seek = s => { offset = s; t0 = performance.now(); if (api.ready) draw(offset); };

    const img = new Image();
    img.onload = () => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(U("u_img"), 0);
      gl.uniform1f(U("u_imgAR"), img.naturalWidth / img.naturalHeight);
      gl.uniform2f(U("u_texel"), 1 / img.naturalWidth, 1 / img.naturalHeight);
      api.ready = true;
      draw(offset);
      if (api.onready) api.onready();
    };
    img.onerror = e => console.warn("Blue Sapphire image could not be loaded:", e);
    img.src = IMG;

    window.addEventListener("resize", () => { if (api.ready && !api.playing) draw(offset); });
    return api;
  };
})();

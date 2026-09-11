(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var vertexSrc = "attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }";

  var fragmentSrc = [
    "precision highp float;",
    "uniform vec2 u_resolution;",
    "uniform float u_time;",
    "vec3 palette(float t) {",
    "  vec3 a = vec3(0.08, 0.06, 0.18);",
    "  vec3 b = vec3(0.42, 0.30, 0.55);",
    "  vec3 c = vec3(1.0, 1.0, 1.0);",
    "  vec3 d = vec3(0.55, 0.55, 0.75);",
    "  return a + b * cos(6.28318 * (c * t + d));",
    "}",
    "void main() {",
    "  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;",
    "  float t = u_time * 0.06;",
    "  vec2 p = uv;",
    "  for (int i = 1; i < 5; i++) {",
    "    float fi = float(i);",
    "    p.x += 0.4 / fi * sin(fi * 2.5 * p.y + t * 1.3 + fi);",
    "    p.y += 0.4 / fi * cos(fi * 2.5 * p.x + t * 1.1 + fi);",
    "  }",
    "  float d = length(uv);",
    "  float pattern = sin(p.x * 3.0 + t) * cos(p.y * 3.0 - t * 0.8);",
    "  vec3 col = palette(pattern * 0.5 + 0.5 + d * 0.2);",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compileShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader = compileShader(gl.VERTEX_SHADER, vertexSrc);
  var fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  var positionLoc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  var resolutionLoc = gl.getUniformLocation(program, "u_resolution");
  var timeLoc = gl.getUniformLocation(program, "u_time");

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    var height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function draw(time) {
    resize();
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  if (reducedMotion) {
    draw(0);
    window.addEventListener("resize", function () {
      draw(0);
    });
    return;
  }

  var rafId = null;
  var startTime = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    draw((now - startTime) / 1000);
    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      startTime = null;
      rafId = requestAnimationFrame(frame);
    }
  });

  window.addEventListener("resize", resize);
})();

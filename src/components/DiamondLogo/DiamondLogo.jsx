import { useEffect, useRef } from "react";

const THREE_SRC = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

function loadThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${THREE_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.THREE), { once: true });
      if (window.THREE) resolve(window.THREE);
      return;
    }
    const script = document.createElement("script");
    script.src = THREE_SRC;
    script.onload = () => resolve(window.THREE);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function DiamondLogo() {
  const box = useRef(null);

  useEffect(() => {
    const element = box.current;
    let frame = 0;
    let renderer;
    let stopped = false;

    loadThree().then((THREE) => {
      if (stopped || !element) return;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0.05, 4.6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      element.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffe7b0, 0.55));
      scene.add(new THREE.HemisphereLight(0xfff3d0, 0xc8962e, 0.45));
      const keyLight = new THREE.DirectionalLight(0xfff8e8, 1.6);
      keyLight.position.set(4, 5, 6);
      scene.add(keyLight);
      const shine = new THREE.PointLight(0xffffff, 1.3, 12);
      shine.position.set(-2, 2, 4);
      scene.add(shine);

      const goldFacet = new THREE.MeshPhysicalMaterial({
        color: 0xd4a017,
        metalness: 0.92,
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        emissive: 0x8a6414,
        emissiveIntensity: 0.18,
        flatShading: true,
      });

      const logo = new THREE.Group();
      logo.scale.setScalar(0.78);
      scene.add(logo);

      const profile = [
        new THREE.Vector2(0, 1.55),
        new THREE.Vector2(0.28, 1.22),
        new THREE.Vector2(0.72, 0.72),
        new THREE.Vector2(1.18, 0.18),
        new THREE.Vector2(0.42, -0.72),
        new THREE.Vector2(0, -1.45),
      ];
      const diamond = new THREE.Mesh(new THREE.LatheGeometry(profile, 8), goldFacet);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(diamond.geometry, 20),
        new THREE.LineBasicMaterial({ color: 0xfff1c2 })
      );
      diamond.add(edges);
      logo.add(diamond);

      function resize() {
        const width = element.clientWidth || 56;
        const height = element.clientHeight || 56;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
        renderer.setSize(width, height, false);
      }
      resize();

      const clock = new THREE.Clock();
      const tick = () => {
        frame = requestAnimationFrame(tick);
        logo.rotation.y = clock.getElapsedTime() * 0.6;
        renderer.render(scene, camera);
      };
      tick();
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      renderer?.dispose();
      if (renderer?.domElement) renderer.domElement.remove();
    };
  }, []);

  return <span ref={box} className="block size-full" aria-hidden="true" />;
}

export default DiamondLogo;

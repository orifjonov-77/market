import * as THREE from 'three';
import { CollisionSystem } from './collision';

/**
 * Birinchi shaxs (First Person) o'yinchi boshqaruvi:
 * - Desktop: WASD / Strelkalar, sichqoncha bilan ko'rish (Pointer Lock)
 * - Mobil: Virtual joystik va sensorli ekran harakatlari
 */
export class PlayerControls {
  public camera: THREE.PerspectiveCamera;
  private collision: CollisionSystem;
  private domElement: HTMLElement;

  // Harakat holatlari
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;

  // Tezlik va fizika
  private moveSpeed = 6.0; // m/s
  private eyeHeight = 1.65; // Odam bo'yi

  // Kamera burchaklari (Euler)
  private pitch = 0; // Vertikal qarash
  private yaw = 0;   // Gorizontal qarash
  public isLocked = false;

  // Mobil joystik kiritmasi
  public joystickVector = { x: 0, y: 0 };

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, collision: CollisionSystem) {
    this.camera = camera;
    this.domElement = domElement;
    this.collision = collision;

    // Boshlang'ich pozitsiya: Supermarket kirish eshigi oldida (Z = 12)
    this.camera.position.set(0, this.eyeHeight, 12);
    this.camera.rotation.order = 'YXZ';

    this.initKeyboardEvents();
    this.initMouseEvents();
    this.initTouchEvents();
  }

  /**
   * Klaviaturani tinglash
   */
  private initKeyboardEvents(): void {
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = true;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = false;
          break;
      }
    });
  }

  /**
   * Sichqoncha Pointer Lock orqali aylanish
   */
  private initMouseEvents(): void {
    this.domElement.addEventListener('click', () => {
      if (!this.isLocked) {
        this.domElement.requestPointerLock?.();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === this.domElement;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isLocked) return;

      const sensitivity = 0.0022;
      this.yaw -= e.movementX * sensitivity;
      this.pitch -= e.movementY * sensitivity;

      // Yuqoriga va pastga qarashni 85 gradus bilan cheklash
      const maxPitch = Math.PI / 2 - 0.05;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

      this.camera.rotation.y = this.yaw;
      this.camera.rotation.x = this.pitch;
    });
  }

  /**
   * Mobil sensorli ekran (joystick va ekranni surish orqali qarash)
   */
  private initTouchEvents(): void {
    const joystickBase = document.getElementById('joystick-base');
    const joystickStick = document.getElementById('joystick-stick');
    let touchId: number | null = null;
    let baseCenter = { x: 0, y: 0 };
    const maxDistance = 40;

    if (joystickBase && joystickStick) {
      joystickBase.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        const rect = joystickBase.getBoundingClientRect();
        baseCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (touchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === touchId) {
            const dx = touch.clientX - baseCenter.x;
            const dy = touch.clientY - baseCenter.y;
            const dist = Math.min(maxDistance, Math.hypot(dx, dy));
            const angle = Math.atan2(dy, dx);

            const clampedX = Math.cos(angle) * dist;
            const clampedY = Math.sin(angle) * dist;

            joystickStick.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;

            // Harakat vektorini normallashtirish (-1 dan 1 gacha)
            this.joystickVector.x = clampedX / maxDistance;
            this.joystickVector.y = clampedY / maxDistance;
          }
        }
      }, { passive: false });

      const resetJoystick = () => {
        touchId = null;
        this.joystickVector.x = 0;
        this.joystickVector.y = 0;
        joystickStick.style.transform = `translate(-50%, -50%)`;
      };

      window.addEventListener('touchend', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            resetJoystick();
          }
        }
      });
      window.addEventListener('touchcancel', resetJoystick);
    }

    // Ekran o'ng tarafini surib qarash (Look touch)
    let lookTouchId: number | null = null;
    let lastLookX = 0;
    let lastLookY = 0;

    window.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.clientX > window.innerWidth / 2 && lookTouchId === null) {
          lookTouchId = touch.identifier;
          lastLookX = touch.clientX;
          lastLookY = touch.clientY;
        }
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (lookTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === lookTouchId) {
          const dx = touch.clientX - lastLookX;
          const dy = touch.clientY - lastLookY;
          lastLookX = touch.clientX;
          lastLookY = touch.clientY;

          const touchSensitivity = 0.004;
          this.yaw -= dx * touchSensitivity;
          this.pitch -= dy * touchSensitivity;

          const maxPitch = Math.PI / 2 - 0.05;
          this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

          this.camera.rotation.y = this.yaw;
          this.camera.rotation.x = this.pitch;
        }
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === lookTouchId) {
          lookTouchId = null;
        }
      }
    });
  }

  /**
   * Har bir render freymida o'yinchi harakatini yangilash
   */
  public update(deltaTime: number): void {
    // deltaTime juda katta bo'lib ketmasligini cheklash
    const delta = Math.min(deltaTime, 0.1);

    // Oldinga va yonlama harakat yo'nalishlari
    const inputZ = (this.moveForward ? -1 : 0) + (this.moveBackward ? 1 : 0) + this.joystickVector.y;
    const inputX = (this.moveRight ? 1 : 0) + (this.moveLeft ? -1 : 0) + this.joystickVector.x;

    if (Math.abs(inputX) > 0.01 || Math.abs(inputZ) > 0.01) {
      // Gorizontal yo'nalish vektorini hisoblash (yaw burchagi bo'yicha)
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

      const moveDir = new THREE.Vector3();
      moveDir.addScaledVector(forward, -inputZ); // forward z=-1 bo'lgani uchun
      moveDir.addScaledVector(right, inputX);
      
      if (moveDir.lengthSq() > 1) {
        moveDir.normalize();
      }

      // Kutilayotgan yangi pozitsiya
      const desiredPos = this.camera.position.clone().addScaledVector(moveDir, this.moveSpeed * delta);
      desiredPos.y = this.eyeHeight;

      // To'qnashuvni hisobga olgan holda to'g'irlash
      const correctedPos = this.collision.resolvePosition(this.camera.position, desiredPos);
      this.camera.position.copy(correctedPos);
    }
  }
}

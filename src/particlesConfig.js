// src/particlesConfig.js
const config = {
  background: {
    color: { 
      value: "transparent" // 使用透明背景，让CSS渐变背景显示
    },
  },
  fpsLimit: 120,
  particles: {
    number: {
      value: 150,
      density: { 
        enable: true, 
        value_area: 1000 
      },
    },
    color: { 
      value: ["#ffffff", "#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6"] // 多种蓝白色调
    },
    shape: { 
      type: ["circle", "triangle", "polygon"],
      options: {
        polygon: {
          sides: 6 // 六边形，类似钻石切面
        }
      }
    },
    opacity: {
      value: { min: 0.3, max: 1 },
      animation: {
        enable: true,
        speed: 2,
        sync: false,
        startValue: "random"
      }
    },
    size: {
      value: { min: 1, max: 4 },
      animation: {
        enable: true,
        speed: 3,
        sync: false,
        startValue: "random"
      }
    },
    move: {
      enable: true,
      speed: { min: 0.5, max: 2 },
      direction: "none",
      random: true,
      straight: false,
      outModes: { 
        default: "out" 
      },
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.05,
        opacity: 1,
        color: {
          value: "#ffffff"
        }
      }
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "bubble"
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 100,
        size: 6,
        duration: 2,
        opacity: 1,
        speed: 3
      }
    }
  },
  detectRetina: true,
  // 添加钻石闪烁效果的发射器
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: false
      },
      rate: {
        quantity: 2,
        delay: 0.5
      },
      shape: "square",
      startCount: 0,
      size: {
        mode: "percent",
        height: 0,
        width: 0
      },
      particles: {
        shape: {
          type: "star",
          options: {
            star: {
              sides: 4,
              inset: 2
            }
          }
        },
        size: {
          value: { min: 2, max: 8 }
        },
        move: {
          speed: { min: 1, max: 3 },
          outModes: {
            default: "destroy"
          }
        },
        color: {
          value: ["#ffffff", "#e1f5fe", "#b3e5fc"]
        },
        opacity: {
          value: { min: 0.5, max: 1 },
          animation: {
            enable: true,
            speed: 4,
            sync: false
          }
        },
        life: {
          duration: {
            sync: false,
            value: { min: 3, max: 8 }
          }
        }
      },
      position: {
        x: { min: 0, max: 100 },
        y: { min: 0, max: 100 }
      }
    }
  ]
};

export default config;
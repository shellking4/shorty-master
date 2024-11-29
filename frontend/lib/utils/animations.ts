export const ANIMATION_VARIANTS = {
  blob: {
    animate: {
      scale: [1, 1.1, 0.9, 1],
      translate: [
        '0px 0px',
        '30px -50px',
        '-20px 20px',
        '0px 0px',
      ],
    },
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'linear',
    },
  },
} as const;
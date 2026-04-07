'use client';

import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { KeyrinCharacter } from '@/components/character/KeyrinCharacter';
import dynamic from 'next/dynamic';

import LoadingFallback from '@/components/ui/LoadingFallback';

// AyrinCharacter is a relatively heavy, animated character component (WebGL/complex
// animation loops). Lazy-load it on the client to reduce initial JS bundle and improve
// first-contentful-paint. SSR is disabled because the component is client-only.
const AyrinCharacter = dynamic(
	() => import('@/components/character/AyrinCharacter').then((m) => m.AyrinCharacter),
	{ ssr: false, loading: () => <LoadingFallback compact /> }
);

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const HIDDEN_ON: string[] = ['/'];

const SUBTLE_ON: string[] = ['/login', '/message'];

type OverlaySide = 'left' | 'right';

function getOverlayConfig(pathname: string) {
	const isMessageLike = pathname.startsWith('/message') || pathname.startsWith('/director');
	const isSubtle = SUBTLE_ON.some((p) => pathname.startsWith(p));

	if (isMessageLike) {
		return {
			opacity: 0.52,
			width: 'clamp(122px, 13vw, 210px)',
			height: 'min(80vh, 760px)',
			scale: 0.9,
			sideFadeWidth: '40%',
			bottomFadeHeight: '10%',
			yTravel: [0, -5, 0, -3, 0],
			hairRotate: [0, 0.3, 0, -0.25, 0],
		};
	}

	if (isSubtle) {
		return {
			opacity: 0.72,
			width: 'clamp(150px, 18vw, 250px)',
			height: '88vh',
			scale: 0.96,
			sideFadeWidth: '32%',
			bottomFadeHeight: '7%',
			yTravel: [0, -8, 0, -5, 0],
			hairRotate: [0, 0.55, 0, -0.4, 0],
		};
	}

	return {
		opacity: 0.92,
		width: 'clamp(180px, 20vw, 280px)',
		height: '92vh',
		scale: 1,
		sideFadeWidth: '28%',
		bottomFadeHeight: '6%',
		yTravel: [0, -10, 0, -6, 0],
		hairRotate: [0, 0.8, 0, -0.6, 0],
	};
}

function getOverlayMotion(side: OverlaySide, scale: number) {
	const direction = side === 'left' ? -1 : 1;
	const restingX = scale < 0.95 ? direction * 28 : 0;
	const hiddenX = direction * (scale < 0.95 ? 82 : 60);
	const exitX = direction * (scale < 0.95 ? 52 : 40);

	return {
		initial: { opacity: 0, x: hiddenX, scale: scale * 0.96 },
		animate: { x: restingX, scale },
		exit: { opacity: 0, x: exitX, scale: Math.max(scale * 0.97, 0.84) },
	};
}

export function CharacterPageOverlay() {
	const pathname = usePathname();
	const leftControls = useAnimationControls();
	const leftHairControls = useAnimationControls();
	const rightControls = useAnimationControls();
	const rightHairControls = useAnimationControls();

	const isHidden = HIDDEN_ON.includes(pathname);
	const overlayConfig = useMemo(() => getOverlayConfig(pathname), [pathname]);
	const leftMotion = getOverlayMotion('left', overlayConfig.scale);
	const rightMotion = getOverlayMotion('right', overlayConfig.scale);

	useEffect(() => {
		leftControls.start({
			y: overlayConfig.yTravel,
			transition: {
				duration: 6,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.3, 0.55, 0.75, 1],
			},
		});
		rightControls.start({
			y: overlayConfig.yTravel,
			transition: {
				duration: 6,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.3, 0.55, 0.75, 1],
			},
		});
	}, [leftControls, overlayConfig.yTravel, rightControls]);

	useEffect(() => {
		leftHairControls.start({
			rotateZ: overlayConfig.hairRotate,
			transition: {
				duration: 7,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.25, 0.5, 0.75, 1],
			},
		});
		rightHairControls.start({
			rotateZ: overlayConfig.hairRotate,
			transition: {
				duration: 7,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.25, 0.5, 0.75, 1],
			},
		});
	}, [leftHairControls, overlayConfig.hairRotate, rightHairControls]);

	return (
		<AnimatePresence>
			{!isHidden &&
				[
					<motion.div
						key="char-overlay-left"
						className="pointer-events-none fixed bottom-0 left-0 z-20 hidden md:flex"
						aria-hidden="true"
						style={{
							width: overlayConfig.width,
							height: overlayConfig.height,
							display: 'flex',
							alignItems: 'flex-end',
						}}
						initial={leftMotion.initial}
						animate={{ ...leftMotion.animate, opacity: overlayConfig.opacity }}
						exit={leftMotion.exit}
						transition={{ duration: 1.4, ease: EASE_SOFT, delay: 0.6 }}
					>
						<div
							className="pointer-events-none absolute inset-y-0 left-0 z-10"
							style={{
								width: overlayConfig.sideFadeWidth,
								background: 'linear-gradient(to right, rgba(5,3,10,0.85), transparent)',
							}}
						/>
						<div
							className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
							style={{
								height: overlayConfig.bottomFadeHeight,
								background: 'linear-gradient(to top, rgba(5,3,10,0.9), transparent)',
							}}
						/>

						<motion.div
							animate={leftControls}
							style={{ width: '100%', height: '100%', transformOrigin: 'bottom center' }}
						>
							<motion.div
								animate={leftHairControls}
								style={{ width: '100%', height: '100%', transformOrigin: 'bottom center' }}
							>
								<KeyrinCharacter />
							</motion.div>
						</motion.div>
					</motion.div>,

					<motion.div
						key="char-overlay-right"
						className="pointer-events-none fixed bottom-0 right-0 z-20 hidden md:flex"
						aria-hidden="true"
						style={{
							width: overlayConfig.width,
							height: overlayConfig.height,
							display: 'flex',
							alignItems: 'flex-end',
						}}
						initial={rightMotion.initial}
						animate={{ ...rightMotion.animate, opacity: overlayConfig.opacity }}
						exit={rightMotion.exit}
						transition={{ duration: 1.4, ease: EASE_SOFT, delay: 0.6 }}
					>
						<div
							className="pointer-events-none absolute inset-y-0 right-0 z-10"
							style={{
								width: overlayConfig.sideFadeWidth,
								background: 'linear-gradient(to left, rgba(5,3,10,0.85), transparent)',
							}}
						/>
						<div
							className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
							style={{
								height: overlayConfig.bottomFadeHeight,
								background: 'linear-gradient(to top, rgba(5,3,10,0.9), transparent)',
							}}
						/>

						<motion.div
							animate={rightControls}
							style={{ width: '100%', height: '100%', transformOrigin: 'bottom center' }}
						>
							<motion.div
								animate={rightHairControls}
								style={{ width: '100%', height: '100%', transformOrigin: 'bottom center' }}
							>
								<AyrinCharacter />
							</motion.div>
						</motion.div>
					</motion.div>,
				]}
		</AnimatePresence>
	);
}

'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { KeyrinCharacter } from '@/components/character/KeyrinCharacter';
import { AyrinCharacter } from '@/components/character/AyrinCharacter';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const HIDDEN_ON: string[] = ['/'];

const SUBTLE_ON: string[] = ['/login', '/message'];

export function CharacterPageOverlay() {
	const pathname = usePathname();
	const leftControls = useAnimationControls();
	const leftHairControls = useAnimationControls();
	const rightControls = useAnimationControls();
	const rightHairControls = useAnimationControls();

	const isHidden = HIDDEN_ON.includes(pathname);
	const isSubtle = SUBTLE_ON.some((p) => pathname.startsWith(p));
	const opacity = isSubtle ? 0.72 : 0.92;

	useEffect(() => {
		leftControls.start({
			y: [0, -10, 0, -6, 0],
			transition: {
				duration: 6,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.3, 0.55, 0.75, 1],
			},
		});
		rightControls.start({
			y: [0, -10, 0, -6, 0],
			transition: {
				duration: 6,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.3, 0.55, 0.75, 1],
			},
		});
	}, [leftControls, rightControls]);

	useEffect(() => {
		leftHairControls.start({
			rotateZ: [0, 0.8, 0, -0.6, 0],
			transition: {
				duration: 7,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.25, 0.5, 0.75, 1],
			},
		});
		rightHairControls.start({
			rotateZ: [0, 0.8, 0, -0.6, 0],
			transition: {
				duration: 7,
				repeat: Infinity,
				ease: 'easeInOut',
				times: [0, 0.25, 0.5, 0.75, 1],
			},
		});
	}, [leftHairControls, rightHairControls]);

	return (
		<AnimatePresence>
			{!isHidden &&
				[
					<motion.div
						key="char-overlay-left"
						className="pointer-events-none fixed bottom-0 left-0 z-20"
						aria-hidden="true"
						style={{
							width: 'clamp(180px, 20vw, 280px)',
							height: '92vh',
							display: 'flex',
							alignItems: 'flex-end',
						}}
						initial={{ opacity: 0, x: -60, scale: 0.96 }}
						animate={{ opacity, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: -40, scale: 0.97 }}
						transition={{ duration: 1.4, ease: EASE_SOFT, delay: 0.6 }}
					>
						<div
							className="pointer-events-none absolute inset-y-0 left-0 z-10"
							style={{
								width: '28%',
								background: 'linear-gradient(to right, rgba(5,3,10,0.85), transparent)',
							}}
						/>
						<div
							className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
							style={{
								height: '6%',
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
						className="pointer-events-none fixed bottom-0 right-0 z-20"
						aria-hidden="true"
						style={{
							width: 'clamp(180px, 20vw, 280px)',
							height: '92vh',
							display: 'flex',
							alignItems: 'flex-end',
						}}
						initial={{ opacity: 0, x: 60, scale: 0.96 }}
						animate={{ opacity, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: 40, scale: 0.97 }}
						transition={{ duration: 1.4, ease: EASE_SOFT, delay: 0.6 }}
					>
						<div
							className="pointer-events-none absolute inset-y-0 right-0 z-10"
							style={{
								width: '28%',
								background: 'linear-gradient(to left, rgba(5,3,10,0.85), transparent)',
							}}
						/>
						<div
							className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
							style={{
								height: '6%',
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

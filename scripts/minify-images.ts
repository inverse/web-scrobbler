import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import type { PluginOption } from 'vite';
import { getBrowser, releaseTarget, releaseTargets } from './util';
import colorLog from './log';

async function performMinification() {
	await imagemin([`build/${getBrowser()}/icons/*.png`], {
		destination: `build/${getBrowser()}/icons`,
		plugins: [imageminPngquant()],
	});
	await imagemin(['src/img/main/*.{jpg,png}'], {
		destination: `build/${getBrowser()}/img`,
		plugins: [imageminMozjpeg(), imageminPngquant()],
	});
	if (releaseTarget === releaseTargets.safari) {
		await imagemin(['src/img/safari/*.{jpg,png}'], {
			destination: '.xcode/Web Scrobbler/Shared (App)/Resources',
			plugins: [imageminMozjpeg(), imageminPngquant()],
		});
	}
}

/**
 * Vite plugin that minifies images then move them to the right place
 */
export default function minifyImages(options: {
	isDev: boolean;
}): PluginOption {
	return {
		name: 'minify-images',
		buildEnd: async () => {
			if (options.isDev) {
				colorLog('Skipping image minification for dev build', 'info');
				return;
			}

			await performMinification();
			colorLog('Finished image minification', 'success');
		},
	};
}

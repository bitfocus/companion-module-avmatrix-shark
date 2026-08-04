import type { DropdownChoice } from '@companion-module/base'

export function sopt(list: readonly (string | number)[]): DropdownChoice<string | number>[] {
	return list
		.filter((x) => x !== -1)
		.map((x, i) => ({
			label: String(x),
			id: i,
		}))
}

export function iopt(list: readonly (string | number)[]): DropdownChoice<string | number>[] {
	return list.map((x) => ({
		label: String(x),
		id: x,
	}))
}

export function title(s: string): string {
	return `[${s}]`
}

export const SOURCE_OPTIONS = sopt([1, 2, 3, 4, 5, 6, 7, 8, 'PAT1', 'PAT2'])

export const AUDIO_ENABLE_OPTIONS = [
	{ label: 'PGM Out', id: 'PGMOUT.Enable' },
	{ label: 'Earphone', id: 'Earphone.Enable' },
	{ label: 'Line In', id: 'LINEIN.Enable' },
	{ label: 'MIC 1', id: 'MICorXLR.MIC1Enable' },
	{ label: 'MIC 2', id: 'MICorXLR.MIC2Enable' },
	{ label: 'XLR', id: 'MICorXLR.XLREnable' },
].concat(
	[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
		return { label: 'IN' + i, id: `AuView${i}.Enable` }
	}),
)

export const AUDIO_VOLUME_OPTIONS = [
	{ label: 'PGM Out', id: 'PGMOUT.Volume' },
	{ label: 'Earphone', id: 'Earphone.Volume' },
	{ label: 'Line In', id: 'LINEIN.Volume' },
	{ label: 'MIC 1', id: 'MICorXLR.MIC1Volume' },
	{ label: 'MIC 2', id: 'MICorXLR.MIC2Volume' },
	{ label: 'XLR', id: 'MICorXLR.XLRVolume' },
].concat(
	[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
		return { label: 'IN' + i, id: `AuView${i}.Volume` }
	}),
)

export const AUDIO_AFV_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
	return { label: 'IN' + i, id: `AuView${i}.AFV` }
})

export const ON_AIR_NAME_OPTIONS = iopt(['KEY1', 'KEY2', 'KEY3', 'DSK', 'LOGO'])

export const ON_AIR_STATUS_OPTIONS = sopt(['OFF', 'KEY', 'ON AIR', 'KEY ON AIR'])

export const AUX_OPTIONS = sopt(['Player', 'UVC', 'Stream', 'NDI'])

export const STREAM_OPTIONS = [1, 2, 3].map((i) => {
	return { label: 'Stream ' + i, id: `StreamSettings${i}.StreamingEnable` }
})

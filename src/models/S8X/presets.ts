import type { ModuleSchema } from '../../main.js'
import type ModuleInstance from '../../main.js'
import type {
	CompanionPresetDefinitions,
	CompanionPresetSection,
	CompanionSimplePresetDefinition,
	CompanionTextSize,
} from '@companion-module/base'
import type { Audio } from './variables.js'
import { ON_AIR_NAME_OPTIONS, ON_AIR_STATUS_OPTIONS, title } from './tool.js'

const SEPARATOR = '\n——\n'

function buildAudioEnable(
	name: string,
	key: keyof Audio,
	enable: string,
	volume: string,
	options: { size: CompanionTextSize } = { size: 'auto' },
): CompanionSimplePresetDefinition<ModuleSchema> {
	return {
		type: 'simple',
		name: name,
		style: {
			text: '`' + title(name) + SEPARATOR + '${' + '$(module:audio)' + `['${key}']` + `['${volume}']` + '}`',
			textExpression: true,
			size: options.size,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AudioEnable',
						options: {
							channel: `${key}.${enable}`,
							enable: true,
							toggle: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'AudioEnable', // 引用反馈
				options: {
					channel: `${key}.${enable}`,
					enable: true,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
}

function buildAudioVolume(
	name: string,
	eve: string,
	direct: string,
	options: { size: CompanionTextSize } = { size: 'auto' },
): CompanionSimplePresetDefinition<ModuleSchema> {
	return {
		type: 'simple',
		name: name,
		style: {
			text: name + '\n' + (direct == 'up' ? '+' : '-'),
			size: options.size,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'AudioAutoVOL',
						options: {
							channel: eve,
							press: true,
							speed: 2,
							direct,
						},
					},
				],
				up: [
					{
						actionId: 'AudioAutoVOL',
						options: {
							channel: eve,
							press: false,
							speed: 2,
							direct,
						},
					},
				],
			},
		],
		feedbacks: [],
	}
}

export function getPresetsDefinitions(_self: ModuleInstance): [CompanionPresetSection[], CompanionPresetDefinitions] {
	const structure: CompanionPresetSection[] = [
		{
			id: 'Sync',
			name: 'Manual Sync',
			definitions: [
				{
					id: 'Sync1',
					name: 'Sync',
					description: ' ',
					type: 'simple',
					presets: ['Sync'],
				},
			],
		},
		{
			id: 'Source',
			name: 'Source',
			definitions: [
				{
					id: 'PGM',
					name: 'PGM',
					description: ' ',
					type: 'simple',
					presets: [1, 2, 3, 4, 5, 6, 7, 8, 'PAT1', 'PAT2'].map((v) => 'PGM' + v),
				},
				{
					id: 'PVW',
					name: 'PVW',
					description: ' ',
					type: 'simple',
					presets: [1, 2, 3, 4, 5, 6, 7, 8, 'PAT1', 'PAT2'].map((v) => 'PVW' + v),
				},
				{
					id: 'Switch',
					name: 'Switch',
					description: ' ',
					type: 'simple',
					presets: ['AUX-Player', 'AUX-UVC', 'AUX-Stream', 'AUX-NDI', 'MUTE', 'FTB', 'CUT', 'AUTO'],
				},
				{
					id: 'OnAir',
					name: 'ON AIR',
					description: ' ',
					type: 'simple',
					presets: ON_AIR_NAME_OPTIONS.flatMap((k) => ON_AIR_STATUS_OPTIONS.map((n) => `${n.label}${k.label}`)),
				},
				{
					id: 'Transitions',
					name: 'Transitions',
					description: ' ',
					type: 'simple',
					presets: ['WIPE1', 'WIPE2', 'WIPE3', 'MIX', 'DIP', 'INV'],
				},
				{
					id: 'Streams',
					name: 'Streams',
					description: ' ',
					type: 'simple',
					presets: ['Stream1', 'Stream2', 'Stream3'],
				},
			],
		},
		{
			id: 'TBar',
			name: 'TBar',
			definitions: [
				{
					id: 'group1',
					name: 'TBar',
					description: ' ',
					type: 'simple',
					presets: ['UP', 'DOWN', 'Postion', 'PostionPercent'],
				},
			],
		},
		{
			id: 'Audio',
			name: 'Audio',
			definitions: [
				{
					id: 'Enable',
					name: 'Enable & Volume',
					description: ' ',
					type: 'simple',
					presets: [
						'IN1',
						'IN2',
						'IN3',
						'IN4',
						'IN5',
						'IN6',
						'IN7',
						'IN8',
						'PGMOUT',
						'LINEIN',
						'Earphone',
						'MIC1',
						'MIC2',
						'XLR',
					],
				},
				{
					id: 'ALLAFV',
					name: 'ALLAFV',
					description: ' ',
					type: 'simple',
					presets: ['ALLAFV'],
				},
				{
					id: 'AFV',
					name: 'AFV',
					description: ' ',
					type: 'simple',
					presets: ['AFV1', 'AFV2', 'AFV3', 'AFV4', 'AFV5', 'AFV6', 'AFV7', 'AFV8'],
				},
				{
					id: 'Volume+',
					name: 'Volume+',
					description: ' ',
					type: 'simple',
					presets: [
						'VOL+1',
						'VOL+2',
						'VOL+3',
						'VOL+4',
						'VOL+5',
						'VOL+6',
						'VOL+7',
						'VOL+8',
						'VOL+PGMOUT',
						'VOL+LINEIN',
						'VOL+Earphone',
						'VOL+MIC1',
						'VOL+MIC2',
						'VOL+XLR',
					],
				},
				{
					id: 'Volume-',
					name: 'Volume-',
					description: ' ',
					type: 'simple',
					presets: [
						'VOL-1',
						'VOL-2',
						'VOL-3',
						'VOL-4',
						'VOL-5',
						'VOL-6',
						'VOL-7',
						'VOL-8',
						'VOL-PGMOUT',
						'VOL-LINEIN',
						'VOL-Earphone',
						'VOL-MIC1',
						'VOL-MIC2',
						'VOL-XLR',
					],
				},
			],
		},
	]

	const presets: CompanionPresetDefinitions<ModuleSchema> = {}
	presets['Sync'] = {
		type: 'simple',
		name: 'Sync',
		style: {
			text: 'Sync',
			size: '24',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'Sync',
						options: {},
					},
				],
				down: [],
			},
		],
		feedbacks: [],
	}
	for (const g of ['PGM', 'PVW']) {
		let i = 0
		for (const k of [1, 2, 3, 4, 5, 6, 7, 8, 'PAT1', 'PAT2']) {
			presets[g + k] = {
				type: 'simple',
				name: g + k,
				style: {
					text: title(g) + k,
					size: '24',
					color: 0xffffff,
					bgcolor: 0x000000,
					show_topbar: false,
				},
				steps: [
					{
						up: [
							{
								actionId: g,
								options: {
									num: i,
								},
							},
						],
						down: [],
					},
				],
				feedbacks: [
					{
						feedbackId: g, // 引用反馈
						options: {
							num: i,
						},
						style: {
							bgcolor: g == 'PVW' ? 0x00ff00 : 0xff0000,
						},
					},
				],
			}
			i++
		}
	}
	presets['AUX'] = {
		type: 'simple',
		name: 'AUX',
		style: {
			text: 'AUX',
			size: '24',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'MUTE',
						options: {
							enable: true,
							toggle: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'MUTE', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					text: 'MUTE',

					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['MUTE'] = {
		type: 'simple',
		name: 'MUTE',
		style: {
			text: 'MUTE',
			size: '24',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'MUTE',
						options: {
							toggle: true,
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'MUTE', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					text: 'MUTE',

					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['FTB'] = {
		type: 'simple',
		name: 'FTB',
		style: {
			text: 'FTB',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			// png64: img,
			// pngalignment: 'center:center',
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'FTB',
						options: {
							enable: true,
							toggle: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'FTB', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					text: 'FTB',

					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['CUT'] = {
		type: 'simple',
		name: 'CUT',
		style: {
			text: 'CUT',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'CUT',
						options: {
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [],
	}
	presets['AUTO'] = {
		type: 'simple',
		name: 'AUTO',
		style: {
			text: 'AUTO',
			size: '24',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AUTO',
						options: {
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [],
	}
	presets['UP'] = {
		type: 'simple',
		name: 'UP',
		style: {
			text: '⬆',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AutoTBar',
						options: {
							press: false,
							direct: 'up',
							speed: 2,
						},
					},
				],
				down: [
					{
						actionId: 'AutoTBar',
						options: {
							press: true,
							direct: 'up',
							speed: 2,
						},
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['DOWN'] = {
		type: 'simple',
		name: 'DOWN',
		style: {
			text: '⬇',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AutoTBar',
						options: {
							press: false,
							direct: 'down',
							speed: 2,
						},
					},
				],
				down: [
					{
						actionId: 'AutoTBar',
						options: {
							press: true,
							direct: 'down',
							speed: 2,
						},
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['Postion'] = {
		type: 'simple',
		name: 'Postion',
		style: {
			text: "$(module:keyboard)['TBAR']",
			textExpression: true,
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [],
				down: [],
			},
		],
		feedbacks: [],
	}
	presets['PostionPercent'] = {
		type: 'simple',
		name: 'Postion Percent',
		style: {
			text: "`${round($(module:keyboard)['TBAR'] /255 * 100)}%`",
			textExpression: true,
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [],
				down: [],
			},
		],
		feedbacks: [],
	}
	presets['AUX-Player'] = {
		type: 'simple',
		name: 'AUX-Player',
		style: {
			text: `[AUX]${SEPARATOR}Player`,
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AUX',
						options: {
							input: 0,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'AUX', // 引用反馈
				options: {
					input: 0,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['AUX-UVC'] = {
		type: 'simple',
		name: 'AUX-UVC',
		style: {
			text: `[AUX]${SEPARATOR}UVC`,
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AUX',
						options: {
							input: 1,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'AUX', // 引用反馈
				options: {
					input: 1,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['AUX-Stream'] = {
		type: 'simple',
		name: 'AUX-Stream',
		style: {
			text: `[AUX]${SEPARATOR}Stream`,
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AUX',
						options: {
							input: 2,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'AUX', // 引用反馈
				options: {
					input: 2,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['AUX-NDI'] = {
		type: 'simple',
		name: 'AUX-NDI',
		style: {
			text: `[AUX]${SEPARATOR}NDI`,
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AUX',
						options: {
							input: 3,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'AUX', // 引用反馈
				options: {
					input: 3,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['WIPE1'] = {
		type: 'simple',
		name: 'WIPE1',
		style: {
			text: `[WIPE]${SEPARATOR}1`,
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'WIPE1',
						options: {
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'WIPE1', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['WIPE2'] = {
		type: 'simple',
		name: 'WIPE2',
		style: {
			text: `[WIPE]${SEPARATOR}2`,
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'WIPE2',
						options: {
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'WIPE2', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['WIPE3'] = {
		type: 'simple',
		name: 'WIPE3',
		style: {
			text: `[WIPE]${SEPARATOR}3`,
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'WIPE3',
						options: {
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'WIPE3', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}

	presets['DIP'] = {
		type: 'simple',
		name: 'DIP',
		style: {
			text: 'DIP',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'DIP',
						options: {
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'DIP', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}

	presets['MIX'] = {
		type: 'simple',
		name: 'MIX',
		style: {
			text: 'MIX',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'MIX',
						options: {
							enable: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'MIX', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['INV'] = {
		type: 'simple',
		name: 'INV',
		style: {
			text: 'INV',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'INV',
						options: {
							enable: true,
							toggle: true,
						},
					},
				],
				down: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'INV', // 引用反馈
				options: {
					enable: true,
				},
				style: {
					bgcolor: 0xff0000,
				},
			},
		],
	}
	presets['ALLAFV'] = {
		type: 'simple',
		name: 'ALLAFV',
		style: {
			text: 'ALLAFV',
			size: 'auto',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'AudioALLAFV',
						options: {},
					},
				],
				down: [],
			},
		],
		feedbacks: [],
	}
	for (const i of ON_AIR_NAME_OPTIONS) {
		for (const j of ON_AIR_STATUS_OPTIONS) {
			const name = j.label + i.label
			presets[name] = {
				type: 'simple',
				name: name,
				style: {
					text: title(i.label) + SEPARATOR + j.label,
					size: '18',
					color: 0xffffff,
					bgcolor: 0x000000,
					show_topbar: false,
				},
				steps: [
					{
						up: [
							{
								actionId: 'OnAir',
								options: {
									name: i.id,
									status: j.id,
								},
							},
						],
						down: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'OnAir', // 引用反馈
						options: {
							name: i.id,
							status: j.id,
						},
						style: {
							bgcolor: 0xff0000,
						},
					},
				],
			}
		}
	}
	for (const i of [1, 2, 3, 4, 5, 6, 7, 8]) {
		const name = 'IN' + i
		presets[name] = buildAudioEnable(name, `AuView${i}` as keyof Audio, 'Enable', 'Volume')
		const name2 = 'AFV' + i
		presets[name2] = {
			type: 'simple',
			name: name2,
			style: {
				text: title(name) + SEPARATOR + 'AFV',
				size: 'auto',
				color: 0xffffff,
				bgcolor: 0x000000,
				show_topbar: false,
			},
			steps: [
				{
					up: [
						{
							actionId: 'AudioAFV',
							options: {
								channel: `AuView${i}.AFV`,
								enable: true,
								toggle: true,
							},
						},
					],
					down: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'AudioAFV', // 引用反馈
					options: {
						channel: `AuView${i}.AFV`,
						enable: true,
					},
					style: {
						bgcolor: 0xff0000,
					},
				},
			],
		}
		for (const d of ['up', 'down']) {
			const pre = d == 'up' ? 'VOL+' : 'VOL-'
			presets[pre + i] = buildAudioVolume(title(name), `AuView${i}.Volume`, d)
		}
	}
	presets['PGMOUT'] = buildAudioEnable('PGMOUT', 'PGMOUT', 'Enable', 'Volume')
	presets['LINEIN'] = buildAudioEnable('LINEIN', 'LINEIN', 'Enable', 'Volume')
	presets['Earphone'] = buildAudioEnable('Earphone', 'Earphone', 'Enable', 'Volume')
	presets['MIC1'] = buildAudioEnable('MIC1', 'MICorXLR', 'MIC1Enable', 'MIC1Volume')
	presets['MIC2'] = buildAudioEnable('MIC2', 'MICorXLR', 'MIC2Enable', 'MIC2Volume')
	presets['XLR'] = buildAudioEnable('XLR', 'MICorXLR', 'XLREnable', 'XLRVolume')

	for (const i of ['up', 'down']) {
		const pre = i == 'up' ? 'VOL+' : 'VOL-'
		presets[pre + 'PGMOUT'] = buildAudioVolume(title('PGMOUT'), 'PGMOUT.Volume', i)
		presets[pre + 'LINEIN'] = buildAudioVolume(title('LINEIN'), 'LINEIN.Volume', i)
		presets[pre + 'Earphone'] = buildAudioVolume(title('Earphone'), 'Earphone.Volume', i)
		presets[pre + 'MIC1'] = buildAudioVolume(title('MIC1'), 'MICorXLR.MIC1Volume', i)
		presets[pre + 'MIC2'] = buildAudioVolume(title('MIC2'), 'MICorXLR.MIC2Volume', i)
		presets[pre + 'XLR'] = buildAudioVolume(title('XLR'), 'MICorXLR.XLRVolume', i)
	}
	for (const i of [1, 2, 3]) {
		const name = `Stream${i}`
		presets[name] = {
			type: 'simple',
			name: name,
			style: {
				text: title('Stream') + SEPARATOR + i,
				size: 'auto',
				color: 0xffffff,
				bgcolor: 0x000000,
				show_topbar: false,
			},
			steps: [
				{
					up: [
						{
							actionId: 'StreamEnable',
							options: {
								channel: `StreamSettings${i}.StreamingEnable`,
								enable: true,
								toggle: true,
							},
						},
					],
					down: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'StreamEnable', // 引用反馈
					options: {
						channel: `StreamSettings${i}.StreamingEnable`,
						enable: true,
					},
					style: {
						bgcolor: 0xff0000,
					},
				},
			],
		}
	}

	return [structure, presets]
}

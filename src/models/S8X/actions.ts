import type { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import type ModuleInstance from '../../main.js'
import {
	AUDIO_AFV_OPTIONS,
	AUDIO_ENABLE_OPTIONS,
	AUDIO_VOLUME_OPTIONS,
	iopt,
	ON_AIR_STATUS_OPTIONS,
	ON_AIR_NAME_OPTIONS,
	SOURCE_OPTIONS,
	AUX_OPTIONS,
	STREAM_OPTIONS,
} from './tool.js'
import type { Audio, Codec, Keyboard } from './variables.js'
import { animate, linear } from 'popmotion'
import type { FeedbacksSchema } from './feedbacks.js'
import type { S8XApi } from './api.js'

export type ActionsSchema = {
	Sync: {
		options: Record<string, never>
	}
	PVW: {
		options: {
			num: number
		}
	}
	PGM: {
		options: {
			num: number
		}
	}
	MUTE: {
		options: {
			enable: boolean
			toggle: boolean
		}
	}
	FTB: {
		options: {
			enable: boolean
			toggle: boolean
		}
	}
	CUT: {
		options: {
			enable: boolean
		}
	}
	AUTO: {
		options: {
			enable: boolean
		}
	}
	WIPE1: {
		options: {
			enable: boolean
		}
	}
	WIPE2: {
		options: {
			enable: boolean
		}
	}
	WIPE3: {
		options: {
			enable: boolean
		}
	}
	MIX: {
		options: {
			enable: boolean
		}
	}
	DIP: {
		options: {
			enable: boolean
		}
	}
	INV: {
		options: {
			enable: boolean
			toggle: boolean
		}
	}
	AutoTBar: {
		options: {
			direct: string
			press: boolean
			speed: number
		}
	}
	OnAir: {
		options: {
			status: number
			name: keyof Keyboard
		}
	}
	AUX: {
		options: {
			input: number
		}
	}
	AudioVOL: {
		options: {
			value: number
			channel: string
		}
	}
	AudioAutoVOL: {
		options: {
			channel: string
			direct: string
			press: boolean
			speed: number
		}
	}
	AudioEnable: {
		options: {
			enable: boolean
			channel: string
			toggle: boolean
		}
	}
	AudioAFV: {
		options: {
			enable: boolean
			channel: string
			toggle: boolean
		}
	}
	AudioALLAFV: {
		options: Record<string, never>
	}
}
const wrapBool = <T extends object>(
	self: ModuleInstance,
	name: keyof FeedbacksSchema,
	key: keyof T,
): CompanionActionDefinition => ({
	name,
	options: [
		{
			id: 'enable',
			type: 'checkbox',
			label: 'Enable',
			default: false,
		},
	],
	callback: async (event) => {
		const s8xapi = self.model.api as S8XApi

		await s8xapi.Keyboard({ [key]: event.options.enable })
		self.checkFeedbacks(name)
	},
})

const wrapKeyboardBool = (self: ModuleInstance, name: keyof FeedbacksSchema, key: keyof Keyboard) =>
	wrapBool<Keyboard>(self, name, key)

const wrapTransitionBool = (self: ModuleInstance, name: keyof FeedbacksSchema, key: keyof Keyboard['Transitions']) =>
	wrapBool<Keyboard['Transitions']>(self, name, key)

export function getActionsDefinitions(self: ModuleInstance): CompanionActionDefinitions {
	const s8xapi = self.model.api as S8XApi

	return {
		Sync: {
			name: 'Sync',
			options: [],
			callback: async (_event) => {
				await s8xapi.sync()
			},
		},
		PVW: {
			name: 'PVW',
			options: [
				{
					id: 'num',
					type: 'dropdown',
					label: 'Number',
					default: SOURCE_OPTIONS[0].id,
					choices: SOURCE_OPTIONS,
				},
			],
			callback: async (event) => {
				await s8xapi.Keyboard({ PVWSource: event.options.num })
				self.checkFeedbacks('PVW')
			},
		},
		PGM: {
			name: 'PGM',
			options: [
				{
					id: 'num',
					type: 'dropdown',
					label: 'Number',
					default: SOURCE_OPTIONS[0].id,
					choices: SOURCE_OPTIONS,
				},
			],
			callback: async (event) => {
				await s8xapi.Keyboard({ PGMSource: event.options.num })
				self.checkFeedbacks('PGM')
			},
		},
		MUTE: {
			name: 'MUTE',
			options: [
				{
					id: 'toggle',
					type: 'checkbox',
					label: 'Toggle',
					default: false,
					disableAutoExpression: true,
					description: 'Automatically switch based on the current state',
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
					isVisibleExpression: '$(options:toggle)==false',
				},
			],
			callback: async (event) => {
				let open = event.options.enable
				if (event.options.toggle) {
					open = !s8xapi.keyboard!.MUTE
				}
				await s8xapi.Keyboard({ MUTE: open })
				self.checkFeedbacks('MUTE')
			},
		},
		FTB: {
			name: 'FTB',
			options: [
				{
					id: 'toggle',
					type: 'checkbox',
					label: 'Toggle',
					default: false,
					disableAutoExpression: true,
					description: 'Automatically switch based on the current state',
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
					isVisibleExpression: '$(options:toggle)==false',
				},
			],
			callback: async (event) => {
				let open = event.options.enable
				if (event.options.toggle) {
					open = !s8xapi.keyboard!.FTB
				}
				await s8xapi.Keyboard({ FTB: open })
				self.checkFeedbacks('FTB')
			},
		},
		CUT: wrapKeyboardBool(self, 'CUT', 'CUT'),
		AUTO: wrapKeyboardBool(self, 'AUTO', 'AUTO'),
		WIPE1: wrapTransitionBool(self, 'WIPE1', 'WIPE1'),
		WIPE2: wrapTransitionBool(self, 'WIPE2', 'WIPE2'),
		WIPE3: wrapTransitionBool(self, 'WIPE3', 'WIPE3'),
		DIP: wrapTransitionBool(self, 'DIP', 'DIP'),
		MIX: wrapTransitionBool(self, 'MIX', 'MIX'),
		INV: {
			name: 'INV',
			options: [
				{
					id: 'toggle',
					type: 'checkbox',
					label: 'Toggle',
					default: false,
					disableAutoExpression: true,
					description: 'Automatically switch based on the current state',
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
					isVisibleExpression: '$(options:toggle)==false',
				},
			],
			callback: async (event) => {
				let open = event.options.enable
				if (event.options.toggle) {
					open = !s8xapi.keyboard!.INV
				}
				await s8xapi.Keyboard({ INV: open })
				self.checkFeedbacks('INV')
			},
		},
		AutoTBar: {
			name: 'AutoTBar',
			options: [
				{
					id: 'press',
					type: 'checkbox',
					label: 'Press',
					default: false,
					disableAutoExpression: true, //必须
				},
				{
					id: 'direct',
					type: 'dropdown',
					label: 'Direct',
					default: 'up',
					choices: iopt(['up', 'down']),
					isVisibleExpression: '$(options:press)==true',
				},
				{
					id: 'speed',
					type: 'number',
					label: 'Speed',
					min: 1,
					max: 10,
					default: 2,
					isVisibleExpression: '$(options:press)==true',
				},
			],
			callback: async (event) => {
				if (self.tbarAni) self.tbarAni.stop()
				const kb = s8xapi.keyboard!
				if (event.options.press) {
					const to = event.options.direct == 'up' ? 0 : 255
					const d = Math.abs(kb.TBAR - to) / ((event.options.speed as number) || 1)
					self.tbarAni = animate({
						from: kb.TBAR,
						to,
						duration: 10 * d,
						ease: linear,
						onUpdate: (latest) => {
							void s8xapi.KeyboardTbar({ TBAR: Math.ceil(latest) })
						},
					})
				}
			},
		},
		OnAir: {
			name: 'ON AIR',
			options: [
				{
					id: 'name',
					type: 'dropdown',
					label: 'Key',
					default: ON_AIR_NAME_OPTIONS[0].id,
					choices: ON_AIR_NAME_OPTIONS,
				},
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					default: ON_AIR_STATUS_OPTIONS[0].id,
					choices: ON_AIR_STATUS_OPTIONS,
				},
			],
			callback: async (event) => {
				const { name, status } = event.options
				await s8xapi.Keyboard({ [name as string]: status })
				self.checkFeedbacks('OnAir')
			},
		},
		AUX: {
			name: 'AUX',
			options: [
				{
					id: 'input',
					type: 'dropdown',
					label: 'Input',
					default: AUX_OPTIONS[0].id,
					choices: AUX_OPTIONS,
				},
			],
			callback: async (event) => {
				await s8xapi.Codec({ DecodeSettings: { AUXInput: event.options.input } })
				self.checkFeedbacks('AUX')
			},
		},
		AudioVOL: {
			name: 'AudioVOL',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: AUDIO_VOLUME_OPTIONS[0].id,
					choices: AUDIO_VOLUME_OPTIONS,
				},
				{
					id: 'value',
					type: 'number',
					label: 'Value',
					default: 0,
					min: -60,
					max: 12,
				},
			],
			callback: async (event) => {
				if (typeof event.options.channel != 'string') return
				const [channel, key] = event.options.channel.split('.')
				await s8xapi.Audio({ [channel]: { [key]: event.options.value } })
			},
		},
		AudioAutoVOL: {
			name: 'AudioAutoVOL',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: AUDIO_VOLUME_OPTIONS[0].id,
					choices: AUDIO_VOLUME_OPTIONS,
				},
				{
					id: 'press',
					type: 'checkbox',
					label: 'Press',
					default: false,
					disableAutoExpression: true, //必须
				},
				{
					id: 'direct',
					type: 'dropdown',
					label: 'Direct',
					default: 'up',
					choices: iopt(['up', 'down']),
					isVisibleExpression: '$(options:press)==true',
				},
				{
					id: 'speed',
					type: 'number',
					label: 'Speed',
					min: 1,
					max: 10,
					default: 2,
					isVisibleExpression: '$(options:press)==true',
				},
			],
			callback: async (event) => {
				if (self.volAni) self.volAni.stop()
				const [channel, key] = (event.options.channel as string).split('.') as [keyof Audio, string]
				const vol = s8xapi.audio?.[channel]?.[key as keyof Audio[typeof channel]]
				if (vol == undefined) {
					self.log('error', 'Volume is undefined')
					return
				}
				if (event.options.press) {
					const to = event.options.direct == 'up' ? 12 : -60
					const d = Math.abs(vol - to) / ((event.options.speed as number) || 1)
					self.volAni = animate({
						from: vol,
						to,
						duration: 100 * d,
						ease: linear,
						onUpdate: (latest) => {
							void s8xapi.Audio({ [channel]: { [key]: Math.ceil(latest) } })
						},
					})
				}
			},
		},
		AudioEnable: {
			name: 'AudioEnable',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: AUDIO_ENABLE_OPTIONS[0].id,
					choices: AUDIO_ENABLE_OPTIONS,
				},
				{
					id: 'toggle',
					type: 'checkbox',
					label: 'Toggle',
					default: false,
					disableAutoExpression: true,
					description: 'Automatically switch based on the current state',
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
					isVisibleExpression: '$(options:toggle)==false',
				},
			],
			callback: async (event) => {
				const [channel, key] = (event.options.channel as string).split('.') as [keyof Audio, string]
				const audio = s8xapi.audio
				let open = event.options.enable
				if (event.options.toggle) {
					open = !audio?.[channel]?.[key as keyof Audio[typeof channel]]
				}
				await s8xapi.Audio({ [channel]: { [key]: open } })
				await s8xapi.loadKeyboard()
				self.checkFeedbacks('AudioEnable', 'MUTE')
			},
		},
		AudioAFV: {
			name: 'AudioAFV',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: AUDIO_AFV_OPTIONS[0].id,
					choices: AUDIO_AFV_OPTIONS,
				},
				{
					id: 'toggle',
					type: 'checkbox',
					label: 'Toggle',
					default: false,
					disableAutoExpression: true,
					description: 'Automatically switch based on the current state',
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
					isVisibleExpression: '$(options:toggle)==false',
				},
			],
			callback: async (event) => {
				const [channel, key] = (event.options.channel as string).split('.') as [keyof Audio, string]
				const audio = s8xapi.audio
				let open = event.options.enable
				if (event.options.toggle) {
					open = !audio?.[channel]?.[key as keyof Audio[typeof channel]]
				}
				await s8xapi.Audio({ [channel]: { [key]: open } })
				self.checkFeedbacks('AudioAFV')
			},
		},
		AudioALLAFV: {
			name: 'AudioALLAFV',
			options: [],
			callback: async (_event) => {
				await s8xapi.Audio({ AudioSetting: { ALLAFV: true } })
				self.checkFeedbacks('AudioAFV')
			},
		},
		StreamEnable: {
			name: 'StreamEnable',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: STREAM_OPTIONS[0].id,
					choices: STREAM_OPTIONS,
				},
				{
					id: 'toggle',
					type: 'checkbox',
					label: 'Toggle',
					default: false,
					disableAutoExpression: true,
					description: 'Automatically switch based on the current state',
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
					isVisibleExpression: '$(options:toggle)==false',
				},
			],
			callback: async (event) => {
				const [channel, key] = (event.options.channel as string).split('.') as [keyof Codec, string]
				const codec = s8xapi.codec
				let open = event.options.enable
				if (event.options.toggle) {
					open = !codec?.[channel]?.[key as keyof Codec[typeof channel]]
				}
				await s8xapi.Codec({ [channel]: { [key]: open } })
				self.checkFeedbacks('StreamEnable')
			},
		},
	}
}

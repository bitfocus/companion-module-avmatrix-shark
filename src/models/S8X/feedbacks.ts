import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../../main.js'
import {
	AUDIO_AFV_OPTIONS,
	AUDIO_ENABLE_OPTIONS,
	AUX_OPTIONS,
	ON_AIR_NAME_OPTIONS,
	ON_AIR_STATUS_OPTIONS,
	SOURCE_OPTIONS,
	STREAM_OPTIONS,
} from './tool.js'
import type { Audio, Codec, Keyboard } from './variables.js'
import type { S8XApi } from './api.js'

export type FeedbacksSchema = {
	PGM: {
		type: 'boolean'
		options: {
			num: number
		}
	}
	PVW: {
		type: 'boolean'
		options: {
			num: number
		}
	}
	MUTE: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	FTB: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	CUT: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	AUTO: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	OnAir: {
		type: 'boolean'
		options: {
			status: number
			name: keyof Keyboard
		}
	}
	WIPE1: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	WIPE2: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	WIPE3: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	MIX: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	DIP: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	INV: {
		type: 'boolean'
		options: {
			enable: boolean
		}
	}
	AUX: {
		type: 'boolean'
		options: {
			input: number
		}
	}
	AudioEnable: {
		type: 'boolean'
		options: {
			enable: boolean
			channel: string
		}
	}
	AudioAFV: {
		type: 'boolean'
		options: {
			enable: boolean
			channel: string
		}
	}
}
const wrapSource = (self: ModuleInstance, name: string, key: keyof Keyboard): CompanionFeedbackDefinition => {
	return {
		name,
		type: 'boolean',
		defaultStyle: {
			bgcolor: 0x00ff00,
		},
		options: [
			{
				id: 'num',
				type: 'dropdown',
				label: 'NUmber',
				default: SOURCE_OPTIONS[0].id,
				choices: SOURCE_OPTIONS,
			},
		],
		callback: (feedback) => {
			const s8xapi = self.model.api as S8XApi
			return s8xapi.keyboard?.[key] == feedback.options.num
		},
	}
}

const wrapBool = (self: ModuleInstance, name: string, key: keyof Keyboard): CompanionFeedbackDefinition => {
	return {
		name,
		type: 'boolean',
		defaultStyle: { bgcolor: 0x00ff00 },
		options: [
			{
				id: 'enable',
				type: 'checkbox',
				label: 'Enable',
				default: false,
			},
		],
		callback: (feedback) => {
			const s8xapi = self.model.api as S8XApi

			return s8xapi.keyboard?.[key] == feedback.options.enable
		},
	}
}

const wrapTransitionBool = (
	self: ModuleInstance,
	name: string,
	key: keyof Keyboard['Transitions'],
): CompanionFeedbackDefinition => {
	return {
		name,
		type: 'boolean',
		defaultStyle: { bgcolor: 0x00ff00 },
		options: [
			{
				id: 'enable',
				type: 'checkbox',
				label: 'Enable',
				default: false,
			},
		],
		callback: (feedback) => {
			const s8xapi = self.model.api as S8XApi

			const tra = s8xapi.keyboard!
			return tra['Transitions']?.[key] == feedback.options.enable
		},
	}
}

export function getFeedbacksDefinitions(self: ModuleInstance): CompanionFeedbackDefinitions {
	const s8xapi = self.model.api as S8XApi

	return {
		PGM: wrapSource(self, 'PGM', 'PGMSource'),
		PVW: wrapSource(self, 'PVW', 'PVWSource'),
		MUTE: wrapBool(self, 'MUTE', 'MUTE'),
		FTB: wrapBool(self, 'FTB', 'FTB'),
		CUT: wrapBool(self, 'CUT', 'CUT'),
		AUTO: wrapBool(self, 'AUTO', 'AUTO'),
		OnAir: {
			name: 'OnAir',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					default: ON_AIR_STATUS_OPTIONS[0].id,
					choices: ON_AIR_STATUS_OPTIONS,
				},
				{
					id: 'name',
					type: 'dropdown',
					label: 'Key',
					default: ON_AIR_NAME_OPTIONS[0].id,
					choices: ON_AIR_NAME_OPTIONS,
				},
			],
			callback: (feedback) => {
				const name = feedback.options.name as keyof Keyboard
				return s8xapi.keyboard?.[name] == feedback.options.status
			},
		},
		WIPE1: wrapTransitionBool(self, 'WIPE1', 'WIPE1'),
		WIPE2: wrapTransitionBool(self, 'WIPE2', 'WIPE2'),
		WIPE3: wrapTransitionBool(self, 'WIPE3', 'WIPE3'),
		DIP: wrapTransitionBool(self, 'DIP', 'DIP'),
		MIX: wrapTransitionBool(self, 'MIX', 'MIX'),
		INV: wrapBool(self, 'INV', 'INV'),
		AUX: {
			name: 'AUX',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [
				{
					id: 'input',
					type: 'dropdown',
					label: 'Input',
					default: AUX_OPTIONS[0].id,
					choices: AUX_OPTIONS,
				},
			],
			callback: (feedback) => {
				return s8xapi.codec?.['DecodeSettings']?.['AUXInput'] == feedback.options.input
			},
		},
		AudioEnable: {
			name: 'AudioEnable',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: AUDIO_ENABLE_OPTIONS[0].id,
					choices: AUDIO_ENABLE_OPTIONS,
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
				},
			],
			callback: (feedback) => {
				const [channel, key] = (feedback.options.channel as string).split('.') as [keyof Audio, string]
				return s8xapi.audio?.[channel]?.[key as keyof Audio[typeof channel]] == feedback.options.enable
			},
		},
		AudioAFV: {
			name: 'AudioAFV',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: AUDIO_AFV_OPTIONS[0].id,
					choices: AUDIO_AFV_OPTIONS,
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
				},
			],
			callback: (feedback) => {
				const [channel, key] = (feedback.options.channel as string).split('.') as [keyof Audio, string]
				return s8xapi.audio?.[channel]?.[key as keyof Audio[typeof channel]] == feedback.options.enable
			},
		},
		StreamEnable: {
			name: 'StreamEnable',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00 },
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: STREAM_OPTIONS[0].id,
					choices: STREAM_OPTIONS,
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					default: false,
				},
			],
			callback: (feedback) => {
				const [channel, key] = (feedback.options.channel as string).split('.') as [keyof Codec, string]
				return s8xapi.codec?.[channel]?.[key as keyof Codec[typeof channel]] == feedback.options.enable
			},
		},
	}
}

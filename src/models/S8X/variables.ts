import type { CompanionVariableDefinitions } from '@companion-module/base'

import type ModuleInstance from '../../main.js'

export type Resp = {
	code: number
	data: object
	message: string
}

export type Token = {
	token: string
	username: string
}

export type Keyboard = {
	ABMode: boolean
	AUTO: boolean
	CUT: boolean
	DSK: number
	FTB: boolean
	FTBWithMUTE: boolean
	INV: number
	KEY1: number
	KEY2: number
	KEY3: number
	LOGO: number
	MUTE: boolean
	NoSRCSwitch: boolean
	PGMSource: number
	PVWSource: number
	SwapCUTAUTO: boolean
	TBAR: number
	TBarEN: boolean
	Transitions: { DIP: boolean; MIX: boolean; WIPE1: boolean; WIPE2: boolean; WIPE3: boolean }
}

export type Codec = {
	DecodeSettings: {
		AUXInput: number
	}
	StreamSettings1: {
		StreamingEnable: boolean
	}
	StreamSettings2: {
		StreamingEnable: boolean
	}
	StreamSettings3: {
		StreamingEnable: boolean
	}
}

export type Audio = {
	AuView1: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AuView2: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AuView3: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AuView4: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AuView5: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AuView6: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AuView7: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AuView8: {
		AFV: boolean
		Delay: number
		Enable: boolean
		Volume: number
	}
	AudioSetting: {
		ALLAFV: number
		Mute: boolean
		Reset: number
	}
	Earphone: {
		Enable: boolean
		Source: number
		Volume: number
	}
	LINEIN: {
		Delay: number
		Enable: boolean
		Volume: number
	}
	MICorXLR: {
		Delay: number
		MIC1Enable: boolean
		MIC1Guitar: boolean
		MIC1Pregain: number
		MIC1Volume: number
		MIC2Enable: boolean
		MIC2Guitar: boolean
		MIC2Pregain: number
		MIC2Volume: number
		Mode: number
		XLREnable: boolean
		XLRVolume: number
	}
	PGMOUT: {
		Enable: boolean
		Volume: number
	}
	SurroundBypass: number
}

export function getVariableDefinitions(_self: ModuleInstance): CompanionVariableDefinitions {
	return {
		keyboard: { name: 'keyboard' },
		audio: { name: 'audio' },
	}
}

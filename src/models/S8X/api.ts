import { InstanceStatus } from '@companion-module/base'
import type ModuleInstance from '../../main.js'
import type { Audio, Codec, Keyboard, Resp, Token } from './variables.js'
import { type BaseDeviceApi } from '../types.js'

export class S8XApi implements BaseDeviceApi {
	private instance: ModuleInstance
	token: string = ''
	keyboard?: Keyboard
	audio?: Audio
	codec?: Codec

	constructor(self: ModuleInstance) {
		this.instance = self
	}

	url(): string {
		return `http://${this.instance.config.host}:${this.instance.config.port}`
	}

	async get(module: string): Promise<Response> {
		const res = await fetch(this.url() + `/board/${module}`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
		// console.log(res)
		if (res.status == 401) {
			await this.login()
			return await this.get(module)
		}
		return res
	}

	async post(module: string, data: object): Promise<Response> {
		const res = await fetch(this.url() + `/board/${module}`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(data),
		})
		// console.log(res)
		if (res.status == 401) {
			await this.login()
			return await this.post(module, data)
		}
		return res
	}

	async connect(): Promise<void> {
		this.abortController?.abort()
		try {
			this.instance.updateStatus(InstanceStatus.Connecting, '⏳')
			await this.login()
			await this.sync()
			void this.connectSSE()
		} catch (e) {
			this.instance.updateStatus(InstanceStatus.ConnectionFailure, '❌' + String(e))
			console.log(e)
			// if (this.instance.config.retry) {
			// console.log('warn', 'Reconnect in 5 seconds')
			// await new Promise((r) => setTimeout(r, 5000))
			// void this.connect()
			// }
		}
	}

	async disconnect(): Promise<void> {
		void this.logout()
		this.abortController?.abort()
		this.abortController = undefined
	}

	async login(): Promise<void> {
		//
		const res = await fetch(this.url() + `/user/login`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				username: this.instance.config.username,
				password: this.instance.secrets.password,
			}),
		})
		const data = (await res.json()) as Resp
		if (data.code != 200) {
			throw Error(data.message)
		}
		const token = data.data as Token
		this.token = token.token
	}

	async logout(): Promise<void> {
		//
		const res = await fetch(this.url() + `/user/logout`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
		const data = (await res.json()) as Resp
		if (data.code != 200) {
			throw Error(data.message)
		}
		this.instance.setVariableValues({
			token: '',
		})
	}

	async sync(): Promise<void> {
		try {
			await Promise.all([this.loadKeyboard(), this.loadCodec(), this.loadAudio()])
			this.instance.checkAllFeedbacks()
		} catch (e) {
			console.error('load', e)
		}
	}

	async loadKeyboard(): Promise<Response> {
		const res = await this.get('Keyboard')
		this.keyboard = (await res.json()) as Keyboard
		this.instance.setVariableValues({
			keyboard: {
				TBAR: this.keyboard.TBAR,
			},
		})
		return res
	}

	async Keyboard(data: object): Promise<void> {
		await this.post('Keyboard', data)
		await this.loadKeyboard()
	}

	async KeyboardTbar(data: object): Promise<void> {
		await this.post('KeyboardTbar', data)
		await this.loadKeyboard()
	}

	async loadCodec(): Promise<Response> {
		const res = await this.get('Codec')
		this.codec = (await res.json()) as Codec
		return res
	}

	async Codec(data: object): Promise<void> {
		await this.post('Codec', data)
		await this.loadCodec()
	}

	async loadAudio(): Promise<Response> {
		const res = await this.get('Audio')
		this.audio = (await res.json()) as Audio
		this.instance.setVariableValues({
			audio: {
				AuView1: {
					Volume: this.audio.AuView1.Volume,
				},
				AuView2: {
					Volume: this.audio.AuView2.Volume,
				},
				AuView3: {
					Volume: this.audio.AuView3.Volume,
				},
				AuView4: {
					Volume: this.audio.AuView4.Volume,
				},
				AuView5: {
					Volume: this.audio.AuView5.Volume,
				},
				AuView6: {
					Volume: this.audio.AuView6.Volume,
				},
				AuView7: {
					Volume: this.audio.AuView7.Volume,
				},
				AuView8: {
					Volume: this.audio.AuView8.Volume,
				},
				Earphone: {
					Volume: this.audio.Earphone.Volume,
				},
				LINEIN: {
					Volume: this.audio.LINEIN.Volume,
				},
				MICorXLR: {
					MIC1Volume: this.audio.MICorXLR.MIC1Volume,
					MIC2Volume: this.audio.MICorXLR.MIC2Volume,
					XLRVolume: this.audio.MICorXLR.XLRVolume,
				},
				PGMOUT: {
					Volume: this.audio.PGMOUT.Volume,
				},
			},
		})
		return res
	}

	async Audio(data: object): Promise<void> {
		await this.post('Audio', data)
		await this.loadAudio()
	}

	private abortController?: AbortController

	async connectSSE(): Promise<void> {
		console.log('info', 'Connecting SSE...')

		this.abortController = new AbortController()
		try {
			const response = await fetch(this.url() + `/watch/${this.token}/notify`, {
				headers: {
					Accept: 'text/event-stream',
				},
				signal: this.abortController.signal,
			})

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`)
			}

			const reader = response.body?.getReader()

			if (!reader) {
				throw new Error('No response body')
			}

			const decoder = new TextDecoder()

			this.instance.updateStatus(InstanceStatus.Ok, '✅')

			while (true) {
				const { done, value } = await reader.read()

				if (done) {
					throw new Error('SSE disconnected')
				}

				const text = decoder.decode(value, {
					stream: true,
				})
				console.log(text)
				if (text.includes('event: dataChange') || text.includes('event: autodone')) {
					await this.sync()
				}
			}
		} catch (err: any) {
			if (err.name === 'AbortError') {
				console.log('SSE aborted')

				return
			}

			console.error('SSE error', err)

			throw err
		} finally {
			this.abortController = undefined
		}
	}
}

import { InstanceStatus } from '@companion-module/base'
import type ModuleInstance from '../../main.js'
import type { Audio, Codec, Keyboard, Resp, Token } from './variables.js'
import { type BaseDeviceApi } from '../types.js'

function isError(err: unknown): err is Error {
	return err instanceof Error
}
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
		if (res.status == 401) {
			this.instance.updateStatus(InstanceStatus.AuthenticationFailure)
			throw new Error('Authentication failed (401)')
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
		if (res.status == 401) {
			//
			this.instance.updateStatus(InstanceStatus.AuthenticationFailure)
			throw new Error('Authentication failed (401)')
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
		} catch (e: unknown) {
			const errorMessage = isError(e) ? e.message : String(e)

			this.instance.updateStatus(InstanceStatus.ConnectionFailure, '❌' + errorMessage)
			this.instance.log('error', errorMessage)
			// if (this.instance.config.retry) {
			// this.instance.log('warn', 'Reconnect in 5 seconds')
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
			throw new Error(data.message || 'Login failed')
		}
		const token = data.data as Token
		this.token = token.token
	}

	async logout(): Promise<void> {
		if (!this.token) return
		try {
			const res = await fetch(this.url() + `/user/logout`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					'Content-Type': 'application/json',
				},
				method: 'GET',
			})
			const data = (await res.json()) as Resp
			if (data.code != 200) {
				this.instance.log('warn', `Logout failed: ${data.message}`)
			}
		} catch (e: unknown) {
			this.instance.log('warn', `Logout error: ${isError(e) ? e.message : String(e)}`)
		} finally {
			this.token = ''
		}
	}

	async sync(): Promise<void> {
		try {
			await Promise.all([this.loadKeyboard(), this.loadCodec(), this.loadAudio()])
			this.instance.checkAllFeedbacks()
		} catch (e: unknown) {
			this.instance.log('error', `Sync failed: ${isError(e) ? e.message : String(e)}`)
		}
	}

	async loadKeyboard(): Promise<Response> {
		const res = await this.get('Keyboard')
		this.keyboard = (await res.json()) as Keyboard
		this.instance.setVariableValues({
			TBAR: this.keyboard.TBAR,
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
			AuView1_Volume: this.audio.AuView1.Volume,
			AuView2_Volume: this.audio.AuView2.Volume,
			AuView3_Volume: this.audio.AuView3.Volume,
			AuView4_Volume: this.audio.AuView4.Volume,
			AuView5_Volume: this.audio.AuView5.Volume,
			AuView6_Volume: this.audio.AuView6.Volume,
			AuView7_Volume: this.audio.AuView7.Volume,
			AuView8_Volume: this.audio.AuView8.Volume,
			Earphone_Volume: this.audio.Earphone.Volume,
			LINEIN_Volume: this.audio.LINEIN.Volume,
			MICorXLR_MIC1Volume: this.audio.MICorXLR.MIC1Volume,
			MICorXLR_MIC2Volume: this.audio.MICorXLR.MIC2Volume,
			MICorXLR_XLRVolume: this.audio.MICorXLR.XLRVolume,
			PGMOUT_Volume: this.audio.PGMOUT.Volume,
		})
		return res
	}

	async Audio(data: object): Promise<void> {
		await this.post('Audio', data)
		await this.loadAudio()
	}

	private abortController?: AbortController

	async connectSSE(): Promise<void> {
		this.instance.log('info', 'Connecting SSE...')

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
				if (text.includes('event: dataChange') || text.includes('event: autodone')) {
					await this.sync()
				}
			}
		} catch (err: unknown) {
			if (err instanceof Error && err.name === 'AbortError') {
				this.instance.log('debug', 'SSE aborted')
				return
			}

			const errorMessage = isError(err) ? err.message : String(err)
			this.instance.log('error', `SSE Error: ${errorMessage}`)
			this.instance.updateStatus(InstanceStatus.ConnectionFailure, '❌ SSE Lost')

			this.instance.log('warn', 'Reconnecting SSE in 5 seconds...')
			setTimeout(() => {
				if (!this.abortController) {
					void this.connectSSE()
				}
			}, 5000)
		} finally {
			if (this.abortController?.signal.aborted) {
				this.abortController = undefined
			}
		}
	}
}

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
// import { MreArgumentError } from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */

export default class HelloWorld {
	private assets: MRE.AssetContainer;
	private button: MRE.Actor = null;
	private elevator: MRE.Actor = null;

	private height: number;
	private speed: number;
	constructor(private context: MRE.Context, private params: MRE.ParameterSet) {
		this.context.onStarted(() => this.started());
	}
	private user: MRE.User;
	/**
	 * Once the context is "started", initialize the app.
	 */
	private async started() {
		// set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);

		if (this.params['height'] !== null) {
			this.height = 4.8;
		}
		else{
			this.height = Number(this.params['height'])
		}
		if (this.params['speed'] !== null) {
			this.speed = 2.5;
		}else{
			this.speed = Number(this.params['speed'])
		}
		// Load a glTF model before we use it
		const buttonMesh = await this.assets.loadGltf('button.glb', "mesh");

		// spawn a copy of the glTF model
		this.button = MRE.Actor.CreateFromPrefab(this.context, {
			// using the data we loaded earlier
			firstPrefabFrom: buttonMesh,
			// Also apply the following generic actor properties.
			actor: {
				name: 'Altspace Cube',
				// Parent the glTF model to the text actor, so the transform is relative to the text
				transform: {
					local: {
						position: { x: 0, y: 0, z: 0 },
						scale: { x: 0.4, y: 0.4, z: 0.4 }
					}
				}
			}
		});

		const elevatorMesh = await this.assets.loadGltf('elevator.glb', "mesh");

		this.elevator = MRE.Actor.CreateFromPrefab(this.context, {
			// using the data we loaded earlier
			firstPrefabFrom: elevatorMesh,
			// Also apply the following generic actor properties.
			actor: {
				name: 'Altspace Cube',
				// Parent the glTF model to the text actor, so the transform is relative to the text
				transform: {
					local: {
						position: { x: 0, y: 0, z: 0 },
						scale: { x: 0.4, y: 0.4, z: 0.4 }
					}
				},
				collider: {
					geometry: { shape: MRE.ColliderType.Box },
					layer: MRE.CollisionLayer.Navigation
				}
			}
		});

		const buttonB = this.button.setBehavior(MRE.ButtonBehavior);

		buttonB.onClick(_ => {
			this.elevatorAnim()
		});

	}
	private elevatorAnim() {
		MRE.Animation.AnimateTo(this.context, this.elevator, {
			destination: { transform: { local: { position: { x: 0, y: this.height, z: 0 } } } },
			duration: this.speed
		});
		this.sleep((this.speed+4)*1000);
		MRE.Animation.AnimateTo(this.context, this.elevator, {
			destination: { transform: { local: { position: { x: 0, y: 0, z: 0 } } } },
			duration: 0
		});


	}
	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}

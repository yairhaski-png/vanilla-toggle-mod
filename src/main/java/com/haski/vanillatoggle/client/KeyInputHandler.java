package com.haski.vanillatoggle.client;

import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.api.Environment;
import net.fabricmc.api.EnvType;
import net.minecraft.client.KeyMapping;
import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.GameRenderer;
import org.lwjgl.glfw.GLFW;

@Environment(EnvType.CLIENT)
public class KeyInputHandler {
	private static KeyMapping toggleKey;

	public static void register() {
		toggleKey = new KeyMapping(
			"key.vanilla-toggle.toggle",
			GLFW.GLFW_KEY_F12,
			"key.categories.misc"
		);

		ClientTickEvents.END_CLIENT_TICK.register(client -> {
			while (toggleKey.consumeClick()) {
				toggleVanillaMode(client);
			}
		});
	}

	private static void toggleVanillaMode(Minecraft client) {
		VanillaToggleClient.isVanillaMode = !VanillaToggleClient.isVanillaMode;

		if (VanillaToggleClient.isVanillaMode) {
			activateVanillaMode(client);
			if (client.gui != null) {
				client.gui.getChat().addMessage(
					net.minecraft.network.chat.Component.literal("§a✓ Vanilla Mode ON")
				);
			}
		} else {
			deactivateVanillaMode(client);
			if (client.gui != null) {
				client.gui.getChat().addMessage(
					net.minecraft.network.chat.Component.literal("§c✗ Vanilla Mode OFF")
				);
			}
		}
	}

	private static void activateVanillaMode(Minecraft client) {
		if (client.gameRenderer != null && client.gameRenderer.currentEffect() != null) {
			client.gameRenderer.shutdownEffect();
		}

		if (client.getResourceManager() != null) {
			client.getResourceManager().unload();
		}
	}

	private static void deactivateVanillaMode(Minecraft client) {
		if (client.getResourceManager() != null) {
			client.getResourceManager().unload();
		}

		if (client.gameRenderer != null) {
			client.gameRenderer.checkShaderCompile();
		}
	}
}

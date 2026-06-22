package com.haski.vanillatoggle.client;

import com.mojang.blaze3d.platform.InputConstants;
import net.fabricmc.api.Environment;
import net.fabricmc.api.EnvType;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.keymapping.v1.KeyMappingHelper;
import net.minecraft.client.KeyMapping;
import net.minecraft.client.Minecraft;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.Identifier;
import org.lwjgl.glfw.GLFW;

import com.haski.vanillatoggle.VanillaToggleMod;

@Environment(EnvType.CLIENT)
public class KeyInputHandler {
	private static final KeyMapping.Category CATEGORY = KeyMapping.Category.register(
		Identifier.fromNamespaceAndPath(VanillaToggleMod.MOD_ID, "general")
	);

	private static KeyMapping toggleKey;

	public static void register() {
		toggleKey = KeyMappingHelper.registerKeyMapping(new KeyMapping(
			"key.vanilla-toggle.toggle",
			InputConstants.Type.KEYSYM,
			GLFW.GLFW_KEY_F12,
			CATEGORY
		));

		ClientTickEvents.END_CLIENT_TICK.register(client -> {
			while (toggleKey.consumeClick()) {
				toggleVanillaMode(client);
			}
		});
	}

	private static void toggleVanillaMode(Minecraft client) {
		VanillaToggleClient.isVanillaMode = !VanillaToggleClient.isVanillaMode;

		if (VanillaToggleClient.isVanillaMode) {
			if (client.gameRenderer != null && client.gameRenderer.currentPostEffect() != null) {
				client.gameRenderer.clearPostEffect();
			}
			if (client.player != null) {
				client.player.sendSystemMessage(Component.literal("§a✓ Vanilla Mode ON"));
			}
		} else {
			if (client.player != null) {
				client.player.sendSystemMessage(Component.literal("§c✗ Vanilla Mode OFF"));
			}
		}
	}
}

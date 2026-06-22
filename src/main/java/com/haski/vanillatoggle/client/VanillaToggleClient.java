package com.haski.vanillatoggle.client;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.api.Environment;
import net.fabricmc.api.EnvType;

@Environment(EnvType.CLIENT)
public class VanillaToggleClient implements ClientModInitializer {
	public static boolean isVanillaMode = false;

	@Override
	public void onInitializeClient() {
		KeyInputHandler.register();
		System.out.println("Vanilla Toggle Client initialized - Press F12 to toggle!");
	}
}

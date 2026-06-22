package com.haski.vanillatoggle.mixin;

import net.minecraft.client.Minecraft;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import com.haski.vanillatoggle.client.VanillaToggleClient;

@Mixin(Minecraft.class)
public class MinecraftClientMixin {

	@Inject(method = "tick", at = @At("HEAD"))
	private void onTick(CallbackInfo ci) {
		Minecraft client = (Minecraft) (Object) this;
		if (VanillaToggleClient.isVanillaMode) {
			if (client.gameRenderer != null && client.gameRenderer.currentEffect() != null) {
				client.gameRenderer.shutdownEffect();
			}
		}
	}
}

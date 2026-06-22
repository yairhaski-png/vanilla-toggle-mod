package com.haski.vanillatoggle.mixin;

import net.minecraft.client.renderer.GameRenderer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import com.haski.vanillatoggle.client.VanillaToggleClient;

@Mixin(GameRenderer.class)
public class GameRendererMixin {

	@Inject(method = "render", at = @At("HEAD"), cancellable = true)
	private void onRender(float partialTick, long nanoTime, boolean renderLevel, CallbackInfo ci) {
		if (VanillaToggleClient.isVanillaMode) {
			GameRenderer self = (GameRenderer) (Object) this;
			if (self.currentPostEffect() != null) {
				self.clearPostEffect();
			}
		}
	}
}

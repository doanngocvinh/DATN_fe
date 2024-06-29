export type EffectBase<T extends string> = {
  type: T;
}


export type HayaoEffect = EffectBase<"none"> | 
EffectBase<"hayao"> | 
EffectBase<"shinkai"> | 
EffectBase<"paprika"> | 
EffectBase<"portraitSketch"> | 
EffectBase<"jpFace">;
export type AiEffect = HayaoEffect;
export type AiEffectType = AiEffect["type"];

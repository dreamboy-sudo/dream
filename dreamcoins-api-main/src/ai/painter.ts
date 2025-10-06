import Replicate, { type FileOutput } from "replicate"
import { log } from "../logger"
import {
  DREAM_PAINTER_PROMPT,
  BALDO_PAINTER_PROMPT,
  THANKSGIVING_PAINTER_PROMPT,
  DREAMGIRL_PAINTER_PROMPT,
} from "./prompts"
import type { DreamMode } from "../lib/types"

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

if (!REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN is required in environment")
}

const DREAM_MODEL = "pleasrdao/dreamofadream:5101fe7e51d233b14ee4fc86492c5ea5b0ee18eedafc27fd08092e4eef8b4a63"
const BALDO_MODEL = "pleasrdao/dreamingonceover:22a245e4c6e6a247dc84d7a3bf25ec0b78e9ff921f04d9c6428972d4644abaf5"
const THANKSGIVING_MODEL = "pleasrdao/newthanks:f241f539881bf7665390a4479cd9d0af66edc79e68c421404dfbdb45e34d0354"
const DREAMGIRL_MODEL = "pleasrdao/dreamgirl-image-1:b08994075a4a528b11bdb018da40bcbee9d55d2169307735d91e52ba734fe169"

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
})

function generatePrompt(prompt: string, mode: DreamMode) {
  switch (mode) {
    case "baldo":
      return `Scene description input: ${prompt}, alongside a completely bald man in either the foreground, up close, or background ${BALDO_PAINTER_PROMPT}`
    case "thanksgiving":
      return `GENERATE THIS SCENE: ${prompt}${THANKSGIVING_PAINTER_PROMPT}`
    case "dreamgirl":
      return `Subject: ${prompt}${DREAMGIRL_PAINTER_PROMPT}`
    default:
      // Dream mode
      return `GENERATE THIS SCENE: ${prompt}${DREAM_PAINTER_PROMPT}`
  }
}

export async function paint(prompt: string, mode: DreamMode) {
  let model: `${string}/${string}` = DREAM_MODEL
  if (mode === "baldo") {
    model = BALDO_MODEL
  } else if (mode === "thanksgiving") {
    model = THANKSGIVING_MODEL
  } else if (mode === "dreamgirl") {
    model = DREAMGIRL_MODEL
  }

  const output = (await replicate.run(model, {
    input: {
      prompt: generatePrompt(prompt, mode),
      model: "dev",
      go_fast: false,
      lora_scale: 0.6,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      guidance_scale: 7,
      output_quality: 90,
      prompt_strength: 1,
      extra_lora_scale: 0.7,
      num_inference_steps: mode === "dreamgirl" ? 40 : 28,
    },
  })) as FileOutput[]

  const blob = await output[0].blob()

  log.info({ prompt }, "Painted an image")
  return blob
}

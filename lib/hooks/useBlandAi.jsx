import axios from "axios";
import { callScript } from "../constants";
const blandApiUrl = "https://api.bland.ai/v1/calls";
const apiKey = process.env.BLAND_API_KEY;
const voiceId = [
  { id: "fc585787-f5a8-4c3d-a16f-759a895c114a", name: "Faye" },
  { id: "923ef241-cffc-4b6d-a59a-9c3ec3614d53", name: "Brady" },
];

const baseUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASE_URL : process.env.NEXT_PUBLIC_DEV_URL;

export async function makeCall(data) {

  const randomIndex = Math.floor(Math.random() * voiceId.length);
  const selectedVoice = voiceId[randomIndex];
  const task = callScript
      .replace(/{{customerName}}/g, data.name)
      .replace(/{{customerEmail}}/g, data.email)
      .replace(/{{customerMessage}}/g, data.message || "")
      .replace(/{{projectType}}/g, data.projectType)
      .replace(/{{cameraCount}}/g, data.cameraCount)
      .replace(/{{timeline}}/g, data.timeline)
      .replace(/{{features}}/g, data.features.join(", "))
      .replace(/{{city}}/g, data.city)
      .replace(/{{budget}}/g, data.budget);

  try {
    const response = await axios.post(
      blandApiUrl,
      {
        phone_number: data.phone,
        from: null,
        task: task,
        language: "eng",
        model: "turbo",
        voice: selectedVoice.id,
        voice_settings: {},
        local_dialing: false,
        max_duration: 12,
        answered_by_enabled: true,
        wait_for_greeting: true,
        record: true,
        amd: false,
        interruption_threshold: 100,
        temperature: null,
        transfer_list: {},
        metadata: {
          yourName: selectedVoice.name,
          redisId: data.redisId,
        },
        pronunciation_guide: [
          {
            word: "asap",
            pronunciation: "a-s-a-p",
            case_sensitive: false,
            spaced: true,
          },
          {
            word: "pos",
            pronunciation: "p-o-s",
            case_sensitive: false,
            spaced: true,
          } 
        ],
        start_time: null,
        request_data: {},
        tools: [],
        analysis_preset: null,
        analysis_schema: {
          didSomeonePickup: "boolean",
          budget: "string",
          numberOfCameras: "string",
          specialFeatures: "string",
          propertyType: "string",
          timeline: "string",
          serviceArea: "string",
          rescheduledCall: "boolean",
          addtionalInformation: "string",
          bookZoom: "boolean",
          depositOfferAccepted: "boolean",
          detailedCallSummary: "string",
        },
        webhook:
          `${baseUrl}/api/call/after`,
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    )
    console.log("first call response:", response.data)
    if (response.data.status === "success" && response.data.call_id) {
      return { success: true };
    }
   
    throw new Error(`Failed to make API call`);
  } catch (error) {
    console.error("Bland AI API error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to make API call",
    };
  }
}

import axios from "axios";
import { callScript } from "../constants";
const blandApiUrl = "https://api.bland.ai/v1/calls";
const apiKey = process.env.BLAND_API_KEY;
const voiceId = [
  { id: "fc585787-f5a8-4c3d-a16f-759a895c114a", name: "Faye" },
  { id: "85a2c852-2238-4651-acf0-e5cbe02186f2",  name: "Bonnie" },
  { id: "bb88042c-7858-4875-a686-8e193414ded5", name:"Stella"}
];

const baseUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASE_URL : process.env.NEXT_PUBLIC_DEV_URL;

export async function makeCall(data) {

  const randomIndex = Math.floor(Math.random() * voiceId.length);
  const selectedVoice = voiceId[randomIndex];
  const task = callScript
      .replace(/{{firstname}}/g, data.firstname)
      .replace(/{{lastname}}/g, data.lastname)
      .replace(/{{email}}/g, data.email)
      .replace(/{{message}}/g, data.message || "")

  try {
    const response = await axios.post(
      blandApiUrl,
      {
        phone_number: data.phone,
        from: 14372920555,
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
        interruption_threshold: 50,
        temperature: null,
        transfer_list: {},
        metadata: {
          yourName: selectedVoice.name,
          uuid: data.uuid,
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
          city: "string",
          rescheduledCall: "boolean",
          bookZoom: "boolean",
          depositOfferAccepted: "boolean",
        
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

package online.webguruji.gurustudy.ai

import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

sealed class AiResponseResult {
    data class Success(val text: String, val isLiveAi: Boolean = true) : AiResponseResult()
    data class Unavailable(val message: String) : AiResponseResult()
    data class Error(val error: String) : AiResponseResult()
}

class GeminiAiHelper {

    private val gson = Gson()

    suspend fun generateStudyExplanation(
        apiKey: String,
        query: String,
        mode: String,
        language: String = "en",
        chapterContext: String = ""
    ): AiResponseResult = withContext(Dispatchers.IO) {
        if (apiKey.isBlank()) {
            return@withContext AiResponseResult.Unavailable(
                "Gemini AI API Key is not configured. Please enter your API key in Settings or below to activate live AI study assistance."
            )
        }

        try {
            val endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8")
            conn.connectTimeout = 15000
            conn.readTimeout = 20000
            conn.doOutput = true

            val langInstruction = if (language == "hi") {
                "Explain in clear, simple conversational Hindi/Hinglish suitable for CBSE Class 10 students."
            } else {
                "Explain in clear, standard English suitable for CBSE Class 10 board examinations."
            }

            val modeInstruction = when (mode) {
                "Step-by-Step" -> "Provide step-by-step mathematical working or scientific reaction breakdown with clear steps (Step 1, Step 2, Final Answer)."
                "Hint First" -> "Do NOT reveal the full answer immediately. Provide 'Hint 1 (Basic Concept)' and 'Hint 2 (Formula/Approach)' to encourage active recall."
                "Revision Summary" -> "Provide a crisp, high-yield CBSE revision summary with key formulas, definitions, and 2 likely board exam questions."
                "Mistake Coach" -> "Explain why students commonly make mistakes on this topic and provide a mnemonic or safety check to avoid losing marks."
                else -> "Explain this concept in simple, intuitive terms strictly aligned with the NCERT Class 10 textbook."
            }

            val systemPrompt = "You are GuruStudy AI Study Assistant for CBSE Class 10 (2026-2027 Session). $langInstruction $modeInstruction Context: $chapterContext. Question: $query"

            val jsonBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        { "text": ${gson.toJson(systemPrompt)} }
                      ]
                    }
                  ],
                  "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 800
                  }
                }
            """.trimIndent()

            val writer = OutputStreamWriter(conn.outputStream, "UTF-8")
            writer.write(jsonBody)
            writer.flush()
            writer.close()

            val responseCode = conn.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream, "UTF-8"))
                val responseStr = reader.readText()
                reader.close()

                val rootObj = gson.fromJson(responseStr, JsonObject::class.java)
                val candidates = rootObj.getAsJsonArray("candidates")
                if (candidates != null && candidates.size() > 0) {
                    val candidate = candidates[0].asJsonObject
                    val contentObj = candidate.getAsJsonObject("content")
                    val parts = contentObj?.getAsJsonArray("parts")
                    val answerText = parts?.get(0)?.asJsonObject?.get("text")?.asString ?: "No response generated."
                    AiResponseResult.Success(answerText, isLiveAi = true)
                } else {
                    AiResponseResult.Error("No candidates returned from Gemini API.")
                }
            } else {
                val errorStream = conn.errorStream
                val errorMsg = if (errorStream != null) {
                    val reader = BufferedReader(InputStreamReader(errorStream, "UTF-8"))
                    val err = reader.readText()
                    reader.close()
                    err
                } else "HTTP $responseCode"
                AiResponseResult.Error("API returned error: $responseCode. Please verify your API key.")
            }
        } catch (e: Exception) {
            e.printStackTrace()
            AiResponseResult.Error("Unable to reach AI service: ${e.localizedMessage ?: "Network error"}. Please check your internet connection or use offline textbook answers.")
        }
    }
}

package online.webguruji.gurustudy.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = RoyalBlueLight,
    onPrimary = Color.White,
    primaryContainer = RoyalBlue,
    onPrimaryContainer = Color(0xFFDBEAFE),
    secondary = SkyBlue,
    onSecondary = Color.White,
    tertiary = AccentPurple,
    background = Slate900,
    surface = Slate800,
    onBackground = Color.White,
    onSurface = Color.White,
    surfaceVariant = Color(0xFF334155),
    onSurfaceVariant = Color(0xFFCBD5E1)
)

private val LightColorScheme = lightColorScheme(
    primary = RoyalBlue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFDBEAFE),
    onPrimaryContainer = RoyalBlue,
    secondary = SkyBlue,
    onSecondary = Color.White,
    tertiary = AccentPurple,
    background = Slate50,
    surface = Color.White,
    onBackground = Slate900,
    onSurface = Slate900,
    surfaceVariant = Slate100,
    onSurfaceVariant = Slate700
)

@Composable
fun GuruStudyTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    accent: String = "royal_blue",
    content: @Composable () -> Unit
) {
    val primaryColor = when (accent) {
        "emerald" -> AccentEmerald
        "purple" -> AccentPurpleColor
        "crimson" -> AccentCrimson
        else -> if (darkTheme) RoyalBlueLight else RoyalBlue
    }

    val baseScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val colorScheme = baseScheme.copy(
        primary = primaryColor,
        primaryContainer = if (darkTheme) primaryColor.copy(alpha = 0.3f) else primaryColor.copy(alpha = 0.15f)
    )

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}

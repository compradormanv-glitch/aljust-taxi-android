plugins {
    id("com.android.application")
}

android {
    namespace = "ao.aljust.taxi"
    compileSdk = 35

    defaultConfig {
        applicationId = "ao.aljust.taxi"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    sourceSets {
        getByName("main") {
            // Usa os ficheiros da aplicação web que já estão na raiz do repositório.
            assets.srcDir(rootProject.projectDir)
            assets.include("index.html")
            assets.include("style.css")
            assets.include("app.js")
            assets.include("config.js")
            assets.include("manifest.json")
            assets.include("icon-192.png")
            assets.include("icon-512.png")
            assets.include("sw.js")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.17.0")
}

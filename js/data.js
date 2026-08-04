// ============================================================
// DATA STATIS — Course Data & Course Map
// Jarang berubah. Edit di sini jika ada course/lesson baru.
// ============================================================

const COURSE_DATA = {
  "Tech Explorer": [
    {
      "num": 1,
      "title": "Lesson 1 - Introduction to Coding and Algorithms",
      "objectives": [
        "Memahami Kecanduan Game Loop",
        "Memahami Coding sebagai Bahasa Komputer",
        "Menyusun Kode dengan Algoritma yang Tepat"
      ],
      "objectives_en": [
        "Understanding Game Loop Addiction",
        "Understanding Coding as a Computer Language",
        "Arrange Coding According to the Correct Algorithm"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Introduction to the Cue/Dash Robot",
      "objectives": [
        "Memahami Konsep Probabilitas (RNG) dalam Permainan",
        "Memahami Konsep Event sebagai Pemicu dalam Coding",
        "Membuat Blok Code Berdasarkan Event dan Tindakan"
      ],
      "objectives_en": [
        "Understanding the Concept of Probability (RNG) in Games",
        "Understanding the Concept of Events as Triggers in Coding",
        "Building Code Blocks Based on Events and Actions"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Introducing Virtual Reality",
      "objectives": [
        "Memahami Strategi Top Up Game yang Tepat",
        "Memahami Virtual Reality"
      ],
      "objectives_en": [
        "Understanding the Right Game Top Up Strategies",
        "Understanding Virtual Reality"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Introduction to the World of Augmented Reality",
      "objectives": [
        "Memahami konsep scrolling tanpa batas dan cara mengatasinya",
        "Mampu mendesain bagian Merge Cube dalam AR",
        "Mampu membuat kuis untuk objek di DelightEx edu",
        "Mampu mengunggah video dan menampilkannya di Merge Cube"
      ],
      "objectives_en": [
        "Understanding the concept of infinite scrolling and how to address it",
        "Capable of designing the Merge Cube section of AR",
        "Capable of coding quizzes for objects in DelightEx edu",
        "Capable of uploading videos and displaying them in Merge Cube"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - What is Loop?",
      "objectives": [
        " Memahami Bahaya Buble Information",
        "Mempelajari Konsep Loop dalam Osmo Coding"
      ],
      "objectives_en": [
        "Understanding the Dangers of Buble Information",
        "Learning the Concept of Loops in Osmo Coding"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Explore Design VR Lebih Advance",
      "objectives": [
        "Mencegah FOMO Selama Event Game Online",
        "Membuat Proyek VR yang Lebih Canggih"
      ],
      "objectives_en": [
        "Preventing FOMO During Online Gaming Events",
        "Creating More Advanced VR Projects"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Explore Design AR Lebih Advance",
      "objectives": [
        "Mampu memahami konsep login harian dalam permainan video serta cara menghindari kecanduan permainan video",
        "Memahami konsep desain rumah sederhana",
        "Memahami Konsep Warna dalam Desain 3D",
        "Menambahkan animasi dan teks ke Delightex Edu"
      ],
      "objectives_en": [
        "Be able to understand the concept of daily logins in video games and how to avoid video game addiction",
        "Understanding the concept of simple home design",
        "Understanding Color Concepts in 3D Design",
        "Adding animations and text to Delightex Edu"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Exam",
      "objectives": [
        "Overview Meeting 1-7",
        "Exam Level Xplorer 1"
      ],
      "objectives_en": [
        "Overview Meeting 1-7",
        "Exam Level Xplorer 1"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Learning Online Safety Using Scratch",
      "objectives": [
        "Mengidentifikasi Bahaya \"Stranger Danger\" di Dunia Maya",
        "Mengoperasikan Antarmuka Dasar Scratch",
        "Mengimplementasikan Kode Event dan Loop pada Animasi"
      ],
      "objectives_en": [
        "Identifying the “Stranger Danger” Threat in the Digital World",
        "Using the Basic Scratch Interface",
        "Implementing Event Handlers and Loops in Animations"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Motion in Scratch",
      "objectives": [
        "Memahami Definisi dari Block Coding Motion pada Scratch",
        "Mengidentifikasi Block Coding Motion yang Tersedia di Scratch",
        "Mengidentifikasi Kapan Harus Menggunakan Block Coding Motion pada Scratch",
        "Membuat Project pada Scratch Menggunakan Block Coding Motion"
      ],
      "objectives_en": [
        "Understanding the Definition of Motion Block Coding in Scratch",
        "Identifying the Motion Blocks Available in Scratch",
        "Identifying When to Use Motion Block Coding in Scratch",
        "Creating a Project in Scratch Using Motion Blocks"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Understanding AI Using Looks Coding",
      "objectives": [
        "Mengenal Block Coding yang Ada pada Tab Looks pada Scratch",
        "Mengidentifikasi Kegunaan Setiap Block Coding pada Tab Looks",
        "Mengidentifikasi Kondisi Kapan Block Coding pada Tab Looks Digunakan",
        "Menerapkan Block Coding pada Tab Looks dalam Contoh Proyek Sederhana"
      ],
      "objectives_en": [
        "Getting to Know Block Coding in the “Looks” Tab in Scratch",
        "Identifying the Purpose of Each Block of Code in the “Looks” Tab",
        "Identifying When to Use Block Coding in the “Looks” Tab",
        "Implementing Block Coding in the “Looks” Tab in a Simple Project"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Sounds in Scratch",
      "objectives": [
        "Memahami Apa Definisi Dari Block Coding Sound pada Scratch",
        "Dapat Mengidentifikasi Block Coding Sound yang Tersedia di Scratch",
        "Dapat Mengidentifikasi Kapan Harus Menggunakan Block Coding Sound pada Scratch",
        "Mampu Membuat Project pada Scratch Menggunakan Block Coding Motion",
        "Mampu Melakukan Editing Sound pada Scratch"
      ],
      "objectives_en": [
        "Understanding the Definition of Block Coding Sounds in Scratch",
        "Be Able to Identify the Sound Blocks Available in Scratch",
        "Be able to identify when to use sound blocks in Scratch",
        "Be able to create a project in Scratch using block coding motion",
        "Be Able to Edit Sound in Scratch"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Events in Scratch",
      "objectives": [
        "Menganalisis Keamanan Digital Melalui QR Code",
        "Memahami Struktur Blok Event pada Scratch",
        "Menguasai Logika Komunikasi Antar-Karakter (Broadcast)"
      ],
      "objectives_en": [
        "Analyzing Digital Security Through QR Codes",
        "Understanding Event Block Structures in Scratch",
        "Mastering the Logic of Inter-Character Communication (Broadcast)"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Control in Scratch",
      "objectives": [
        "Memahami Manfaat dan Keamanan Cloud Storage",
        "Menguasai Logika Perulangan (Looping Control)",
        "Menerapkan Percabangan Kondisional (Conditional Logic)"
      ],
      "objectives_en": [
        "Understanding the Benefits and Security of Cloud Storage",
        "Mastering Loop Control",
        "Implementing Conditional Logic"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Sensing in Scratch",
      "objectives": [
        "Memahami Konsep dari Search Engine",
        "Memahami Apa Definisi Dari Block Coding Sensing pada Scratch",
        "Dapat Mengidentifikasi Block Coding Sensing yang Tersedia di Scratch",
        "Dapat Mengidentifikasi Kapan Harus Menggunakan Block Coding Sensing pada Scratch",
        "Mampu Membuat Project pada Scratch Menggunakan Block Coding Sensing"
      ],
      "objectives_en": [
        "Understanding the Concept of Search Engines",
        "Understanding the Definition of Block Coding and Sensing in Scratch",
        "Be Able to Identify the Sensing Blocks Available in Scratch",
        "Be Able to Identify When to Use Block Coding and Sensing in Scratch",
        "Be Able to Create Projects in Scratch Using Block Coding and Sensors"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Exam 2",
      "objectives": [
        "Memahami Manfaat dan Keamanan Cloud Storage",
        "Overview Meeting 9-15",
        "Written Exam",
        "Coding Exam"
      ],
      "objectives_en": [
        "Understanding the Benefits and Security of Cloud Storage",
        "Overview Meeting 9-15",
        "Written Exam",
        "Coding Exam"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Operator in Scratch",
      "objectives": [
        "Mampu Membuat Password yang Kuat",
        "Memahami Apa Definisi dari Block Coding Operator pada Scratch",
        "Dapat Mengidentifikasi Block Coding Operator yang Tersedia di Scratch",
        "Dapat Mengidentifikasi Kapan Harus Menggunakan Block Coding Operator pada Scratch",
        "Mampu Membuat Project pada Scratch Menggunakan Block Coding Operator"
      ],
      "objectives_en": [
        "Ability to Create Strong Passwords",
        "Understanding the Definition of the Block Coding Operator in Scratch",
        "Be able to identify the block coding operators available in Scratch",
        "Be able to identify when to use block coding operators in Scratch",
        "Be able to create projects in Scratch using block coding"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Variable in Scratch",
      "objectives": [
        "Memahami Konsep Deepfake",
        "Memahami Apa Definisi dari Block Coding Variable pada Scratch",
        "Dapat Mengidentifikasi Block Coding Variable yang Tersedia di Scratch",
        "Dapat Mengidentifikasi Kapan Harus Menggunakan Block Coding Variable pada Scratch",
        "Mampu Membuat Project pada Scratch Menggunakan Block Coding Variable",
        "Pengenalan Variable dan List"
      ],
      "objectives_en": [
        "Understanding the Concept of Deepfakes",
        "Understanding the Definition of Block Coding Variables in Scratch",
        "Be Able to Identify the Block Coding Variables Available in Scratch",
        "Be Able to Identify When to Use Variable Blocks in Scratch",
        "Be Able to Create Projects in Scratch Using Block Coding and Variables",
        "Introduction to Variables and Lists"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - My Blocks in Scratch",
      "objectives": [
        "Memahami Konsep Otomasi dalam Kehidupan Sehari-hari",
        "Mengenal Konsep Function dalam Coding",
        "Mengenal Block Coding My Blocks Pada Scratch"
      ],
      "objectives_en": [
        "Understanding the Concept of Automation in Everyday Life",
        "Understanding the Concept of Functions in Coding",
        "Getting to Know Block Coding with My Blocks in Scratch"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - AI Edu Delightex",
      "objectives": [
        "Memahami Dasar Teknologi Generative AI",
        "Menguasai Teknik Prompting yang Efektif",
        "Menerapkan Etika dan Kejujuran dalam Karya AI",
        "Mengintegrasikan AI Buddy ke dalam Lingkungan VR Edu Delightex"
      ],
      "objectives_en": [
        "Understanding the Basics of Generative AI Technology",
        "Mastering Effective Prompting Techniques",
        "Applying Ethics and Integrity in AI Work",
        "Integrating AI Buddy into the Delightex Educational VR Environment"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Collecting Game Assets with AI Tools",
      "objectives": [
        "Memahami Apa Fungsi Slide Presentasi",
        "Memahami Cara Mendapatkan Ide Project Game",
        "Mengumpulkan Asset Project Game Baik dari Internet Maupun AI"
      ],
      "objectives_en": [
        "Understanding the Purpose of Presentation Slides",
        "Understanding How to Come Up with Game Project Ideas",
        "Collecting Game Project Assets from Both the Internet and AI"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - AI Voice Maker",
      "objectives": [
        "Memahami Teknologi di Balik AI Voice",
        "Mengintegrasikan Aset Audio ke dalam Desain Proyek Digital",
        "Melanjutkan Proses Desain dari Asset Game yang Telah Dikumpulkan"
      ],
      "objectives_en": [
        "Understanding the Technology Behind AI Voice",
        "Integrating Audio Assets into Digital Project Design",
        "Continuing the Design Process with Collected Game Assets"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - AI Ethics",
      "objectives": [
        "Menanggapi Konsep Kepemilikian pada Seni AI",
        "Menyelesaikan Tahap Coding pada Project Final ",
        "Mengerti Apa Saja yang Harus Dilakukan Saat Coding Project Final"
      ],
      "objectives_en": [
        "Addressing the Concept of Ownership in AI Art",
        "Completing the Coding Phase of the Final Project",
        "Understanding What Needs to Be Done When Coding the Final Project"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Presenting Digital Projects",
      "objectives": [
        "Memahami Poin Penting Apa Saja yang Ada pada Presentasi",
        "Mengerjakan Written Exam dengan Seksama ",
        "Mempresentasikan Project dengan Baik"
      ],
      "objectives_en": [
        "Understanding the Key Points in a Presentation",
        "Taking the Written Exam Carefully ",
        "Presenting a Project Effectively"
      ]
    }
  ],
  "3D ANIMATOR": [
    {
      "num": 1,
      "title": "Lesson 1 - What is Computer?",
      "objectives": [
        "Pengenalan apa itu komputer dan bagian-bagiannya",
        "Mengetahui cara menjaga Gadget agar tidak rusak"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Play with Alphabet",
      "objectives": [
        "Latihan mengetik di komputer",
        "Mengetahui pentingnya Media Balance"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Coding is a Language",
      "objectives": [
        "Pengenalan Coding sebagai bahasa komputer",
        "Pentingnya mengurangi screen time"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Introduction to Robot",
      "objectives": [
        "Berkenalan dengan Robot",
        "Menggerakkan Robot dengan coding"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - What is Event?",
      "objectives": [
        "Pengenalan dan penerapan event dalam coding",
        "Menggerakkan Robot dengan coding"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Looping with Scrat",
      "objectives": [
        "Pengenalan konsep Loop dalam Coding",
        "Mengimplementasikan konsep Loop pada game"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Coding Animation in ScratchJr",
      "objectives": [
        "Mengenal aplikasi ScratchJr",
        "Belajar membuat animasi dengan coding"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Overview & Challenge 1",
      "objectives": [
        "Review Lesson 1-7",
        "Coding Challenge 1"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Rocket to the Moon",
      "objectives": [
        "Menggunakan mode grid untuk melihat posisi karakter di ScratchJr",
        "Membuat animasi roket terbang ke bulan"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Send The Message in ScratchJr",
      "objectives": [
        "Mengetahui fungsi kode Message di ScratchJr",
        "Membuat game animasi Animal Race"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Bugs On The Internet",
      "objectives": [
        "Mengetahui apa itu Internet dan manfaatnya",
        "Mengetahui cara melakukan Debugging"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Play with Shapes",
      "objectives": [
        "Belajar sambil bermain dengan shapes",
        "Mengetahui apa saja yang boleh dibagikan ke internet"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Moving Shapes!",
      "objectives": [
        "Mengingat kembali tombol pada Robot",
        "Menggerakkan Robot dengan coding"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Basketball Animation",
      "objectives": [
        "Berlatih membuat animasi di ScratchJr",
        "Membuat animasi Basketball"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Animation Project in ScratchJr",
      "objectives": [
        "Membuat proyek akhir di ScratchJr"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Overview & Challenge 2",
      "objectives": [
        "Review Lesson 9-15",
        "Coding Challenge 2"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - My Own 3D World",
      "objectives": [
        "Mengetahui apa itu game tiga dimensi (3D Game)",
        "Belajar membuat 3D Game dengan Kodu"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Underwater 3D Game",
      "objectives": [
        "Berlatih membuat 3D Game",
        "Membuat dunia bawah air di Kodu"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Condition for Robot's Censor",
      "objectives": [
        "Mengenal konsep Conditional dalam coding",
        "Membuat coding pada sensor Robot"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Cycle Race in Kodu",
      "objectives": [
        "Berlatih membuat 3D Game",
        "Membuat Racing Game di Kodu"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - The Ground is Lava",
      "objectives": [
        "Berlatih membuat 3D Game",
        "Melengkapi coding pada project yang disediakan"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Clap Censor in Robot",
      "objectives": [
        "Perkenalan dengan sensor baru pada Robot",
        "Belajar memrogram sensor tepuk tangan dan suara"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - 3D World Project",
      "objectives": [
        "Membuat design plan untuk project akhir 3D Game",
        "Membuat proyek akhir 3D Game dengan Kodu"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Overview & Challenge 3",
      "objectives": [
        "Review Lesson 17-23",
        "Coding Challenge 3"
      ]
    }
  ],
  "Adcanced Lua Programming on Roblox": [
    {
      "num": 1,
      "title": "Lesson 1 - Intro to Battle Royale",
      "objectives": [
        "Memahami game development pada battle royale game",
        "Mempersiapkan map",
        "Mempelajari multiplayer game loop",
        "Menambahkan chest yang bisa terbuka"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Teleport to Arena",
      "objectives": [
        "Mempelajari lobby system",
        "Mempelajari konsep table & for loop in pairs",
        "Membuat teleport system"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Match: Equip Sword in the Chest",
      "objectives": [
        "Membuat model sword",
        "Membuat coding untuk sword"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Match: Health Potion",
      "objectives": [
        "Menambahkan health potion",
        "Menambahkan gun player"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Match: Set Timer & GUI",
      "objectives": [
        "Menerapkan timer module",
        "Membuat screen gui yang dinamis"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Match: Ending Match",
      "objectives": [
        "Memahami proses pengembalian player kalah ke lobby",
        "Memahami cara mengakhiri match"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Match: Cleanup & Reset",
      "objectives": [
        "Memahami proses kembali ke intermission"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Exam",
      "objectives": [
        "Review",
        "Exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Cleaner Boat Simulator",
      "objectives": [
        "Mengetahui alur game cleaner boat simulator",
        "Memahami proses persiapan materials"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Placement System: Creating GUI",
      "objectives": [
        "Memahami proses membuat screen gui untuk membangun boat"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Placement System: Coding the System",
      "objectives": [
        "Memahami cara kerja placement system"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Launch Boat & Remove Material",
      "objectives": [
        "Coding untuk launch boat",
        "Coding untuk remove material boat"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Get Coins by Collecting Trash",
      "objectives": [
        "Mempelajari cara kerja collecting trash dengan boat",
        "Mampu menampilkan jumlah sampah di screen gui"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Upgrade Boat: Prepare The Quiz",
      "objectives": [
        "Mempelajari cara menonaktifkan materials dari screen gui",
        "Mampu membuat desain quiz gui"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Upgrade Boat: Manage Quiz",
      "objectives": [
        "Mampu membuat quiz untuk upgrade boat",
        "Memahami proses upgrade boat"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Exam",
      "objectives": [
        "Review",
        "Exam"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Math Obby: Generate Questions",
      "objectives": [
        "Memahami cara menampilkan soal"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Math Obby: Generate Answer",
      "objectives": [
        "Memahami cara menampilkan pilihan jawaban",
        "Memahami cara memeriksa jawaban player"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Roblox Game Exploration",
      "objectives": [
        "Mengeksplorasi ide game",
        "Membuat rencana game yang akan dibuat",
        "Mulai membuat lingkungan dan model"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Modelling Game",
      "objectives": [
        "Menyelesaikan model game"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Start to Code",
      "objectives": [
        "Membuat kode-kode yang diperlukan"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Continue Coding",
      "objectives": [
        "Melanjutkan proses coding"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Add Game Pass",
      "objectives": [
        "Menambahkan game pass dalam game"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Present Your Game",
      "objectives": [
        "Mempresentasikan hasil game"
      ]
    }
  ],
  "AI Computer Vision": [
    {
      "num": 1,
      "title": "Lesson 1 - OpenCV Image Manipulation",
      "objectives": [
        "Mengetahui konsep Computer Vision",
        "Menggunakan OpenCV Library",
        "Mengetahui konsep Image Processing",
        "Mengetahui teknik blurring menggunakan OpenCV",
        "Mengetahui Image Manipulation menggunakan OpenCV"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Tensorflow dan CNN",
      "objectives": [
        "Mengetahui konsep dan kebutuhan pembuatan model computer vision",
        "Mengetahui arsitektur model CNN",
        "Mengetahui Tools Tensorflow untuk melatih model",
        "Mengetahui Tools Tensorflow untuk melatih model"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Horse and Human Classification",
      "objectives": [
        "Mengetahui sumber pengumpulan dataset Computer Vision",
        "Mengetahui cara penggunaan Tensorflow dataset",
        "Mengetahui cara melakukan data augmentasi menggunakan Image Data Generator",
        "Membuat project Horse and Human Classification"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Face Detection",
      "objectives": [
        "Menggunakan Pre-trained model dan Machine Learning Framework",
        "Membuat aplikasi face detection di gambar",
        "Membuat aplikasi face detection di video"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - MobileNetSSD Object Detection",
      "objectives": [
        "Mengetahui arsitektur model Single Shot Detector (SSD)",
        "Dapat membuat project Object Detection menggunakan Model SSD",
        "Mengimplementasikan project object Detector baik itu di gambar atau di video"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Object Detection VS Object Tracking",
      "objectives": [
        "Mengetahui konsep Object Tracking dan cara kerjanya",
        "Mengetahui perbedaan Object Detection dan Tracking",
        "Mengetahui konsep Euclidean Distance Tracker",
        "Mengetahui konsep countour detection",
        "Mengetahui konsep image thresholding"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Euclidean Distance Tracker Class",
      "objectives": [
        "Mengaplikasikan penggunaan Euclidean Distance Tracker Class",
        "Menambahkan Unique Identification dari object yang terdeteksi untuk proses tracking",
        "Menambahkan \"marker\" untuk object yang sedang di track"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Review and Middle Exam",
      "objectives": [
        "Review Concepts",
        "Middle Exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Automatic Number Plate Recognation (ANPR)",
      "objectives": [
        "Mengetahui konsep tentang Optical Character Recognition (OCR)",
        "Mengatahui cara manipulasi image processing untuk OCR",
        "Menggunakan library easyocr untuk ANPR",
        "Mendalami konsep image masking dan contours detection"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - OCR Handwriting Recognation",
      "objectives": [
        "Mengetahui implementasi lain OCR / OCR Handwritting",
        "Menggunakan pre-trained model menggunakan keras library",
        "Menggunakan Image Processing untuk OCR Handwritting"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - hand Landmarks Detection",
      "objectives": [
        "Pengenalan Mediapipe Library untuk landmark detection",
        "Menggunakana Mediapipe untuk Holistic Tracking",
        "Mendalami konsep Image Manipulation di Video Frames",
        "Membuat project Virtual Painter"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Find Landmark Position",
      "objectives": [
        "Mencari posisi landmark tangan menggunakan method enumerate()",
        "Mengetahui klasifikasi landmark pada tangan",
        "Menginisialisasi mode pada project Virtual Painter (Selection dan Drawing)",
        "Finishing project dengan teknis Video Frame Masking"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Mediapipe Face Mesh",
      "objectives": [
        "Mengetahui anatomi Face Mesh di Mediapipe",
        "Menggambar landmark menggunakan Face Mesh Landmark model",
        "Membuat project Pig Face Filter menggunakan Mediapipe"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Mediapipe Facial Area",
      "objectives": [
        "Mengetahui implementasi dari Face Mesh Landmark",
        "Mengetahui Facial Area yang ada di dalam Mediapipe",
        "Membuat project Face FIlter Dragon Project",
        "Membuat class Face Mesh untuk mendeteksi Facial Area"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Detect Mouth and Eye",
      "objectives": [
        "Mengidentifikasi apakah mulut terbuka atau tidak",
        "Mengidentifikasi apakah mulut terbuka atau tidak",
        "Melakukan Video masking untuk menempelkan efek filter ke dalam frames"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Summary and Final Exam",
      "objectives": [
        "Review Concepts",
        "Final Exam"
      ]
    }
  ],
  "AI Machine Learning": [
    {
      "num": 1,
      "title": "Lesson 1 - What is Machine Learning ?",
      "objectives": [
        "Mengetahui hubungan AI, Machine Learning, dan Deep Learning",
        "Mengetahui apa itu Machine Learning dan kategorinya",
        "Mengetahui cara kerja Machine Learning",
        "Using Pandas as a dataframe manipulation library"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Iris Flowers Classification",
      "objectives": [
        "Mengetahui cara kerja Classification",
        "Membedakan data train dan data testing",
        "Mengolah dan Mempersiapkan dataset Iris Flower",
        "Membaca dan Memvisualisasikan dataset menggunakan Seaborn"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Iris Flowers Classification II",
      "objectives": [
        "Mengetahui cara kerja Algoritma KNN Classifier",
        "Melakukan training model menggunakan algoritma KNN",
        "Melakukan model evaluation",
        "Melakukan proses parameter tuning dari model yang sudah dilatih",
        "Melakukan prediksi dari model yang sudah dibuat"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Natural Language Processing (NLP)",
      "objectives": [
        "Pengenalan konsep Natural Language Processing (NLP)",
        "Mengetahui bagaimana cara NLP bekerja",
        "Explorasi NLP menggunakan ChatGPT",
        "Menggunakan NLTK untuk proses NLP di Python"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Sentiment Analysis Vectorization",
      "objectives": [
        "Mengetahui proses yang ada di dalam Sentiment Analysis",
        "Mengetahui konsep Feature Extractin dan Vectorization",
        "Membuat project Spotify Review Sentiment Analysis"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Review Classification",
      "objectives": [
        "Mengetahui bagaimana cara kerja algortima Random Forest Classifier",
        "Mengetahui bagaimana cara kerja Naive bayes Classifier bekerja",
        "Meningkatkan skor akurasi model yang sudah di latih",
        "Membuat prediksi berdasarkan model sentiment analysis yang sudah dibuat"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Fake News Detection",
      "objectives": [
        "Mengimplementasikan penggunaan lain NLP",
        "Membuat project Fake News Detection menggunakan konsep NLP",
        "Membandingkan model Classification dan Regression",
        "Memahami penggunaan algoritma Logistic Regression"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Summary and Middle Exam",
      "objectives": [
        "Review Concepts",
        "Middle Exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Time Series Forecasting",
      "objectives": [
        "Mengetahui konsep Time Series Forecasting",
        "Mengetahui bagaimana konsep fungsi linear",
        "Mengetahui cara kerja algoritma Linear Regression",
        "Membuat project Population Prediction menggunakan model Linear Regression"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Predict Future Sales",
      "objectives": [
        "Mengetahui konsep cara kerja Sales Forecasting",
        "Membuat project Sales Prediction",
        "Menggunakan library Plotly untuk VIsualisasi Data",
        "Memahami konsep Feature Engineering",
        "Membuat Feature data waktu berdasarkan Feature yang lain"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Neural Network",
      "objectives": [
        "Mengetahui konsep Rolling Windows untuk investigasi data",
        "Mengetahui konsep Exponentially Weighted Moving Average",
        "Mengetahui konsep Logarithmic Transformation",
        "Mengetahui Konsep Neural Network",
        "Membuat prediksi menggukan model neural network"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Unsupervised Learning",
      "objectives": [
        "Understanding Concept about Unsupervised learning",
        "Identify type of Unsupervised learning",
        "Understanding concept of Clustering using K Means algorithm",
        "Customer Segmentation project"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Recommendation System",
      "objectives": [
        "Understanding the concept of Recommender System",
        "Indentify the type of Recommender System",
        "Understanding how content based filtering and collaborative filtering works",
        "Implement it to Course Recommendation System"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Anomaly Detection with Isolated Forest",
      "objectives": [
        "Understanding the detail concept of Unsupervised Anomaly Detection",
        "Understanding the method for Anomaly Detection",
        "Understanding how isolated forest algorithm works",
        "Credit card fraud detection"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Review materials & Final Exam",
      "objectives": [
        "Review materials",
        "Written Exam",
        "Coding Exam - Part 1"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Finishing the Exam",
      "objectives": [
        "Coding Exam - Part 2",
        "Coding Exam submission"
      ]
    }
  ],
  "Android Developer": [
    {
      "num": 1,
      "title": "Lesson 1 - React Native Framework and Components",
      "objectives": [
        "Pengenalan React Native Framework",
        "View, Text, Button Component",
        "Mengatur Tampilan Component"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Styling Your Layout",
      "objectives": [
        "Mempelajari Layout Style",
        "Memahami Box Model",
        "Mempelajari Text Style",
        "Mempelajari TouchableOpacity Component"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Flex Layout and Add Image",
      "objectives": [
        "Memahami Flex layout dan Flex Direction",
        "Menambahkan Image Component",
        "Mempelajari Image Style",
        "Menambahkan ScrollView Component"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Props and Reusable Component",
      "objectives": [
        "Mempelajari ImageBackground & Text Input Component",
        "Mempelajari Properti Opacity",
        "Mempelajari Props",
        "Mempelajari Reusable Component"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Add Custom Font and Icon into a Popular Layout",
      "objectives": [
        "Menambahkan Custom Font",
        "Menambahkan Icon",
        "Membuat Popular Layout"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - React Native Hooks",
      "objectives": [
        "Mengenal Hooks pada React Native",
        "Mempelajari  Penggunaan useState dan useEffect",
        "Mempelajari setTimeout",
        "Membuat Project Guess the Country Screen"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Stack Navigation and Another Way of using useEffect",
      "objectives": [
        "Mempelajari Stack Navigation",
        "Mempelajari Cara Lain Penggunaan useEffect Hook",
        "Mengenal Properti flexGrow"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Review and Middle Test",
      "objectives": [
        "Review concepts",
        "Middle  exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - FlatList and StyleSheet",
      "objectives": [
        "Mengenal FlatList pada React Native",
        "Mempelajari StyleSheet pada React Native",
        "Membuat Home Screen Movie Collection Project"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Learn More About FlatList and Sort The Data",
      "objectives": [
        "Mempelajari Tentang Horizontal FlatList",
        "Menambahkan Component Lain sebelum dan setelah FlatList",
        "Mengurutkan Data Array of Objects"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Ternary Operator and  Combine StyleSheet with Inline Style",
      "objectives": [
        "Mempelajari Mengenai Ternary Operator",
        "Menggabungkan StyleSheet dan Inline Style",
        "Melanjutkan Home Screen Movie Collection Project"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Passing Data Between Screens",
      "objectives": [
        "Mempelajari Cara Mengirim Data ke Screen lainnya",
        "Mempelajari Cara Menerima Data yang Telah Dikirim",
        "Membuat Detail Movie Screen"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Empty FlatList and Column in FlatList",
      "objectives": [
        "Menampilkan 3 Data Teratas",
        "Menampilkan Pesan saat Tidak Ada Data pada FlatList",
        "Mempelajari Cara Menambah Kolom pada FlatList",
        "Membuat Most Viewed Movie Screen"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Change The Header in Stack Navigation",
      "objectives": [
        "Mempelajari Cara Mengubah Header",
        "Membuat Recommended Movie Screen"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Android Apps Development 1 Exam Part 1",
      "objectives": [
        "Android Apps Development 1 Exam Part 1"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Android Apps Development 1 Exam Part 2",
      "objectives": [
        "Android Apps Development 1 Exam Part 2"
      ]
    }
  ],
  "Coding Explorer": [
    {
      "num": 1,
      "title": "Lesson 1 - Coding Language and Algorithm",
      "objectives": [
        "Mengenal Coding sebagai Bahasa Komputer",
        "Menyusun Coding sesuai Algoritma yang Benar"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Screen Time in Event and Loop",
      "objectives": [
        "Memahami pengaruh Screen Time dan Gadget Addiction",
        "Menggunakan Event dan Loop dalam Coding"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Making Friends in Scratch",
      "objectives": [
        "Mencegah dan mengatasi Cyber Bullying",
        "Menggunakan Scratch untuk membuat game sederhana"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Gadget Protection in Various Condition",
      "objectives": [
        "Mengetahui cara Penggunaan dan Perawatan Gadget dengan benar",
        "Mengenal konsep Conditional dan penerapannya dalam Coding"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Digital Footprints in Virtual World",
      "objectives": [
        "Mengenal Virtual Reality"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Message in The Sky",
      "objectives": [
        "Mengetahui apa itu Mindfull Message",
        "Mengenal dan mengendalikan Drone secara virtual"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Gliding Bug",
      "objectives": [
        "Memahami arti Bug pada program",
        "Mengenal Glide pada Scratch dan penerapan pada game"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Overview and Exam 1",
      "objectives": [
        "Overview Meeting 1-7",
        "Exam Level Xplorer 1"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Never Give Up in Conditional Loop",
      "objectives": [
        "Pentingnya Tetap Berusaha dan Pantang Menyerah",
        "Mengenal Conditional Loop dalam Coding",
        "Micro:bit Truth or Dare Game"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Spamming Forever",
      "objectives": [
        "Mengenal Spam dan Cara Menghindarinya",
        "Algoritma dalam Memecahkan Masalah",
        "Menggunakan Kode Forever dalam Coding"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Computer Virus and Undersea AR",
      "objectives": [
        "Mengenal virus komputer dan cara mengatasinya",
        "Membuat aquarium dengan AR Cube"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Flying in Scratch",
      "objectives": [
        "Membuat Flying game dalam Scratch"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Variable in Technology Development",
      "objectives": [
        "Perkembangan teknologi dalam kehidupan manusia",
        "Mengenal Variable dalam Coding"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Function in VR",
      "objectives": [
        "Menggunakan Function dalam VR"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - AI in Python",
      "objectives": [
        "Mengenal Artificial Intelligence",
        "Mengenal Text Coding dan Bahasa Pemrograman Python"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Overview and Exam 2",
      "objectives": [
        "Overview Meeting 1-7",
        "Exam Level Xplorer 2"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Media Balance for Broadcasting a Clone",
      "objectives": [
        "Mengenal media balance",
        "Membuat game dengan konsep broadcast dan clone"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - List of IoT",
      "objectives": [
        "Internet of Things untuk membantu kehidupan",
        "Mengenal List dalam Coding"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Soccer Game",
      "objectives": [
        "Menggunakan Scratch untuk membuat Soccer Game"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Additive Design In The World",
      "objectives": [
        "Mengenal konsep Additive design",
        "Membuat game Create Own World - Part 1"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Game Creation - Part 1",
      "objectives": [
        "Membuat Game Sendiri",
        "Menentukan Ide dan Mengumpulkan Aset Game"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Game Creation - Part 2",
      "objectives": [
        "Membuat Game Sendiri",
        "Menyusun Game Layout, Coding Start Layout, dan Coding Main Game"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Game Creation - Part 3",
      "objectives": [
        "Membuat Game Sendiri",
        "Menambahkan life, score, next level, dan game over pada game"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Game Creation - Part 4",
      "objectives": [
        "Membuat Game Sendiri",
        "Presentasi Game, Feedback, Debugging dan Share Game"
      ]
    },
    {
      "num": 25,
      "title": "Lesson 25 - Intro to Mobile Apps and APP Inventor",
      "objectives": [
        "Pengenalan tentang Mobile Apps",
        "Pengenalan tentang MIT App Inventor"
      ]
    },
    {
      "num": 26,
      "title": "Lesson 26 - For Loop in Time",
      "objectives": [
        "Membuat Clicker App",
        "Membuat Timer App"
      ]
    },
    {
      "num": 27,
      "title": "Lesson 27 - Translator and Spinner in Dictionary Apps",
      "objectives": [
        "Pengenalan Tentang Translator APP",
        "Menggunakan Spinner dan Speech Recognizer dalam Translator App"
      ]
    },
    {
      "num": 28,
      "title": "Lesson 28 - Calculator for Distance Apps",
      "objectives": [
        "Membuat aplikasi kalkulator",
        "Membuat My Walk App dengan pedometer"
      ]
    },
    {
      "num": 29,
      "title": "Lesson 29 - Drawing for game",
      "objectives": [
        "Membuat aplikasi menggambar",
        "Membuat game Tic tac Toe"
      ]
    },
    {
      "num": 30,
      "title": "Lesson 30 - App exploration and assets preparation",
      "objectives": [
        "Explorasi ide aplikasi buatanmu",
        "Menyiapkan assets"
      ]
    },
    {
      "num": 31,
      "title": "Lesson 31 - Layouting and Coding",
      "objectives": [
        "Membuat app sesuai dengan tema yang dipilih"
      ]
    },
    {
      "num": 32,
      "title": "Lesson 32 - Launching and Presentation",
      "objectives": [
        "Launching dan presentasi  App buatan sendiri"
      ]
    }
  ],
  "Full Stack Programming on Roblox": [
    {
      "num": 1,
      "title": "Lesson 1 - Intro to Roblox Studio and Obby Game",
      "objectives": [
        "Mengenal roblox game",
        "Mengenal interface pada roblox studio",
        "Memahami proses modelling",
        "Membuat obby game"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Variables & Properties",
      "objectives": [
        "Memahami pengertian coding",
        "Mempelajari konsep variable",
        "Mempelajari konsep properti",
        "Mempelajari konsep reusing code"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Model in Roblox Studio",
      "objectives": [
        "Mempelajari proses modeling",
        "Mempelajari tool effect"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Intro to Terrain on Mini Adventure Game",
      "objectives": [
        "Mengenal adventure game",
        "Mengenal terrain editor dan penerapannya",
        "Membuat terrain dan model sell platform"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Leaderboard & Function",
      "objectives": [
        "Mempelajari leaderboard",
        "Mempelajari konsep function"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Conditional Statement on Harvestable Item",
      "objectives": [
        "Mengetahui cara kerja harvestable item",
        "Memahami konsep conditional statement"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Sell Item & Add Obstacle",
      "objectives": [
        "Mengetahui cara kerja sell platform"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Review & Exam",
      "objectives": [
        "Review",
        "Exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Custom Player Character",
      "objectives": [
        "Mampu membuat karakter player sendiri",
        "Memahami cara menggerakkan custom player"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Event & Create Bullet",
      "objectives": [
        "Mempelajari konsep event",
        "Membuat model bullet"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Script For Bullet",
      "objectives": [
        "Mampu membuat coding untuk spawn bullet"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Remote Event on GUI",
      "objectives": [
        "Memahami alur story game",
        "Memahami dan menerapkan screen gui",
        "Memahami dan menerapkan remote event"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - How The Story Starts",
      "objectives": [
        "Memahami pengertian module script",
        "Mempelajari pembuatan screen gui yang dinamis"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Animation in Roblox",
      "objectives": [
        "Mengenal pengertian animasi",
        "Mengetahui cara membuat animasi di roblox",
        "Menerapkan animasi pada story game"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Task 2 and Ending The Story",
      "objectives": [
        "Mempelajari click detector",
        "Memahami alur task 2",
        "Menerapkan efect di task 3"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Review & Exam",
      "objectives": [
        "Review",
        "Exam"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Roblox Game Exploration",
      "objectives": [
        "Mengeksplorasi ide game",
        "Membuat rencana game yang akan dibuat",
        "Mulai membuat desain model dan lingkungan game"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Continue Modelling",
      "objectives": [
        "Menyelesaikan model game"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Start to Code",
      "objectives": [
        "Mulai membuat kode-kode yang dibutuhkan"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Continue Coding",
      "objectives": [
        "Melanjutkan proses coding"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Coding for Ending",
      "objectives": [
        "Menyelesaikan proses coding"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Feedback & Revise",
      "objectives": [
        "Menunjukkan progress game ke teman sekelas",
        "Memberi dan menerima feedbacks dari teman sekelas dan guru"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - How to Earn Robux",
      "objectives": [
        "Memahami cara mendapatkan robux dalam game yang dibuat"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Play a Test With Friends",
      "objectives": [
        "Mempresentasikan hasil game"
      ]
    }
  ],
  "Game Developer": [
    {
      "num": 1,
      "title": "Lesson 1 - Pengenalan Construct dan Jumping Platform",
      "objectives": [
        "Mengenal website Construct 3",
        "Menggunakan behavior untuk menggerakkan sprite"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Navigate Through the Map",
      "objectives": [
        "Menyusun Maze",
        "Menggunakan Event Sheet"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Animate Inside Layout",
      "objectives": [
        "Mengenal Animation Frame",
        "Menggunakan behavior 8 Direction dan Bound to Layout"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Enemy, Score, and Next Level",
      "objectives": [
        "Menambahkan enemy dan score",
        "Membuat next level pada game"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Aim and Shoot",
      "objectives": [
        "Mengarahkan sprite mengikuti mouse pointer",
        "Mempelajari behaviour physics"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Particles and Next Stage",
      "objectives": [
        "Menambahkan Particles Effect",
        "Menambahkan Level 2 pada game"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Overview and Exam",
      "objectives": [
        "Overview Meeting 1-6",
        "Exam Game Dev 1"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Exam",
      "objectives": [
        "Exam Game Dev 1"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Bouncing Ball and Floating Block",
      "objectives": [
        "Menggerakkan paddle dan memantulkan bola",
        "Menyusun blocks & menambahkan instance variable"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Life and Next Level",
      "objectives": [
        "Menambahkan Variable dan Respawn Ball",
        "Menambahkan level pada game"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Layout and Button",
      "objectives": [
        "Menambahkan Start, Win, dan Game Over Layout",
        "Menambahkan Start and Replay Button"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Select Player and Shoot Random Meteor",
      "objectives": [
        "Membuat srolling background dan menggerakkan player",
        "Memilih player yang akan dimainkan dan rancom costume obstacles"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Life, Score, and Family Feature",
      "objectives": [
        "Menggunakan Sprite font untuk Score dan Life",
        "Menggunakan Family Features pada Construct"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Instance Variable and Game Over",
      "objectives": [
        "Menambahkan enemy dengan instance variable",
        "Menambahkan efek Stardust dengan Particles"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Overview and Exam",
      "objectives": [
        "Overview Meeting 1-6"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Exam",
      "objectives": [
        "Exam Game Dev 2"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Tilemap and Touch",
      "objectives": [
        "Membuat desain layout dengan Tilemap",
        "Menggerakkan player pada game platformer"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Obstacles and Items",
      "objectives": [
        "Menambahkan obstacles dan enemy pada Game",
        "Menambahkan item pada Game"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Shoot To The Next Level",
      "objectives": [
        "Menambahkan Next Level",
        "Membuat Item Menempel Pada Player"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - AI Enemy and Upload",
      "objectives": [
        "Menambahkan AI Enemy",
        "Mengupload Game ke Website"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Game Creation -Part 1",
      "objectives": [
        "Explorasi ide game",
        "Mengumpulkan asset"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Game Creation -Part 2",
      "objectives": [
        "Menyusun Layout"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Game Creation -Part 3",
      "objectives": [
        "Finishing and Debugging",
        "Prepare Launch"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Game Creation -Part 4",
      "objectives": [
        "Launch Game",
        "Presentation"
      ]
    }
  ],
  "Code and Design with Roblox": [
    {
      "num": 1,
      "title": "Lesson 1 - Getting To Know Computer & Roblox",
      "objectives": [
        "Memahami perangkat yang digunakan untuk komputer",
        "Pengenalan tentang roblox",
        "Literasi game",
        "Mempersiapkan roblox studio"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Creating Your First Model",
      "objectives": [
        "Memahami menu dan shortcut di roblox studio",
        "Pengenalan tentang modeling",
        "Membuat sebuah model rumah"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Imitate Google Images into 3D Models",
      "objectives": [
        "Memahami tools modelling",
        "Membuat sebuah model menggunakan referensi google image",
        "Memahami tentang anchor",
        "Memahami save to roblox dan collaborate"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Using Toolbox & Effects",
      "objectives": [
        "Memahami konsep parent & children",
        "Memahami kegunaan toolbox",
        "Membuat sebuah efek",
        "Menyelesaikan project rumah"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Introduction to Terrain",
      "objectives": [
        "Merancang latar belakang map",
        "Memahami tool terrain editor",
        "Membuat project baru"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - More Tools in Editor",
      "objectives": [
        "Memahami smooth dan flatten",
        "Menggunakan plugin brush tool"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Publish to Roblox",
      "objectives": [
        "Memahami copyright",
        "Memahami cara Publish project"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Exam",
      "objectives": [
        "Review",
        "Exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Advanced Terrain Editor Tools",
      "objectives": [
        "Memahami rings of responsibility",
        "Memahami generate tool di terrain editor",
        "Membuat game underwater"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Solid Modeling",
      "objectives": [
        "Memahami tool solid modeling",
        "Membuat rumah underwater",
        "Memahami gravitasi di roblox"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Script on Object",
      "objectives": [
        "Memahami tentang screen time",
        "Memahami tentang scripting",
        "Memahami properties",
        "Membuat script untuk part"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Adding Text & Sound",
      "objectives": [
        "Menambahkan papan yang berisi tulisan",
        "Menambahkan suara",
        "Mengubah atmosphere"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Variable in Coding",
      "objectives": [
        "Memahami cyber bullying",
        "Memahami konsep variable dan jenisnya",
        "Memahami konsep Instance.new()",
        "Memahami kode wait()"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - While Loop",
      "objectives": [
        "Memahami konsep loop dan while loop",
        "Menggunakan while loop",
        "Menambahkan script untuk menggerakan object"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Animation in Roblox",
      "objectives": [
        "Mengenal animasi",
        "Memahami tools untuk membuat Animasi",
        "Membuat sebuah animasi untuk Farmland"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Review & Exam Test",
      "objectives": [
        "Review materi meeting 9 - 15",
        "Roblox explorer 2 exam"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Image Label on Parts",
      "objectives": [
        "Memahami fungsi dari image label",
        "Menggunakan image label pada part",
        "Membuat nama meja"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Setting a Trap For Forbidden Area",
      "objectives": [
        "Memahami fungsi dari trap",
        "Membuat laser dengan beam effect untuk trap",
        "Membuat trap pada pintu menuju kitchen"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Create Your Own: Exploring Ideas",
      "objectives": [
        "Mengeksplorasi bangunan dan model",
        "Memahami aturan dan etika membuat project",
        "Membuat draft ide bangunan",
        "Memulai modeling bangunan"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Create Your Own: Continue Modelling",
      "objectives": [
        "Memahami kombinasi warna",
        "Tips untuk modelling",
        "Melanjutkan modelling bangunan"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Create Your Own: Finish Modelling",
      "objectives": [
        "Menambahkan detail pada object",
        "Menyelesaikan modelling bangunan"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Create Your Own: Adding Interactive Models",
      "objectives": [
        "Memahami Interactive parts",
        "Menambahkan scripts kedalam game"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Create Your Own: Prepare for Presentation",
      "objectives": [
        "Membuat presentasi tentang project"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Presentation",
      "objectives": [
        "Mempresentasikan hasil project"
      ]
    }
  ],
  "Interactive Mechanics on Roblox": [
    {
      "num": 1,
      "title": "Lesson 1 - Creating a Theme Park",
      "objectives": [
        "Membuat desain map",
        "Review terrain tools",
        "Membuat lingkungan theme park",
        "Mengubah atmosphere map theme park"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Event on Interactive Model",
      "objectives": [
        "Membuat model interaktif",
        "Memahami event dalam coding",
        "Membuat script untuk komedi putar"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - How to Design a Shirt",
      "objectives": [
        "Pengenalan photopea",
        "Membuat desain baju sederhana",
        "Mengimport desain ke asset manager",
        "Coding untuk menggunakan baju pada game"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Escape Building Game",
      "objectives": [
        "Membuat storyline",
        "Mempersiapkan clue pada game",
        "Modelling bangunan"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Conditional Statement in Matching Door",
      "objectives": [
        "Modelling kunci",
        "Memahami konsep conditional statement",
        "Coding kunci dan pintu"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Find the Clue!",
      "objectives": [
        "Modelling clue",
        "Coding show text label",
        "Menambahkan lightswitch"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Final Touch and Publish",
      "objectives": [
        "Configuring atmosphere",
        "Modeling headlamp",
        "Publish and play together"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Review & Exam",
      "objectives": [
        "Review meeting 1-7",
        "Exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Intro to Blender",
      "objectives": [
        "Introduction to blender",
        "Learning basic controls of blender",
        "Create your first model"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Modelling in Blender",
      "objectives": [
        "Membuat model botol",
        "Modeling aksesori player",
        "Export object ke roblox studio"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Object Showcase",
      "objectives": [
        "Import object pada project",
        "Mengenal tentang screen gui",
        "Mendesign screen gui",
        "Menggunakan tween service"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Finding Object Game",
      "objectives": [
        "Merencanakan game",
        "Modeling map dan bangunan",
        "Menambahkan lukisan dengan image label"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Completing Map & Clues",
      "objectives": [
        "Melanjutkan modeling bangunan dan interior.",
        "Menentukan lokasi objek yang akan disembunyikan",
        "Menambahkan screen gui untuk clue"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Designing Object in Blender",
      "objectives": [
        "Membuat model low poly: barrel",
        "Membuat model untuk object utama Finding Game"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Coding Collect System",
      "objectives": [
        "Exporting dan importing banyak parts dari blender",
        "Membuat gui yang muncul saat menemukan objek",
        "Menambahkan coding untuk mengambil objek"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Review & Exam",
      "objectives": [
        "Review meeting 9-16",
        "Exam"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Game Promotion",
      "objectives": [
        "Memahami places dan fungsinya",
        "Menggabungkan game sebelumnya ke lobby",
        "Membuat gambar untuk badges dan game pass"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Monetization in Game",
      "objectives": [
        "Memahami struktur thumbnail dan game icon",
        "Membuat tombol return",
        "Membuat opening GUI"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Create Your Own",
      "objectives": [
        "Merencanakan game yang akan dibuat",
        "Menambahkan place baru kedalam project lobby",
        "Memulai modelling game"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Create Your Own",
      "objectives": [
        "Melanjutkan modelling",
        "Menggunakan blender untuk modelling"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Create Your Own",
      "objectives": [
        "Menambahkan GUI",
        "Menambahkan tween animation"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Create Your Own",
      "objectives": [
        "Menambahkan kode untuk misi",
        "Menambahkan script teleport dengan event touch"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Create Your Own",
      "objectives": [
        "Membuat presentasi project",
        "Membuat thumbnail"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Create Your Own",
      "objectives": [
        "Presentasi project"
      ]
    }
  ],
  "JavaScript Developer": [
    {
      "num": 1,
      "title": "Lesson 1 - Hello, World!",
      "objectives": [
        "Mengetahui apa itu coding beserta cangkupannya.",
        "Mengetahui bahasa pemrograman JavaScript.",
        "Mengetahui apa itu algoritma."
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Hoax and Variable",
      "objectives": [
        "Mengetahui tentang hoax dan mengidentifikasi hoax",
        "Mengetahui konsep variabel dan tipe data."
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Operator and Expression",
      "objectives": [
        "Mengetahui konsep operator dalam coding.",
        "Memperdalam konsep operator aritmatika dan penugasan."
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Storing Multiple Data in Array",
      "objectives": [
        "Mengetahui cara mengatasi Cyberbullying.",
        "Mengetahui konsep array."
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - What If? Conditional Logic",
      "objectives": [
        "Memahami konsep conditional dalam coding.",
        "Menggunakan operator comparison dan logical"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Media & Switch Conditions",
      "objectives": [
        "Membuat kehidupan seimbang",
        "Memahami conditional dengan switch statement dan ternary operator."
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Problem Solving  For Loop",
      "objectives": [
        "Memahami proses penyelesaian masalah",
        "Memahami loop dalam coding"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Review and Middle Test",
      "objectives": [
        "Memahami kembali materi meeting 1-7",
        "Middle test"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Nested and Conditional Loop",
      "objectives": [
        "Memahami nested for loop",
        "Memahami conditional loop"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Create Some Programs!",
      "objectives": [
        "Membuat beberapa program dengan JavaScript"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Real or Fake? Function",
      "objectives": [
        "Memahami manipulasi foto dan video",
        "Memahami function dalam coding"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Function Parameter",
      "objectives": [
        "Mengetahui konsep paramater pada function"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Copyright and Scope",
      "objectives": [
        "Mengetahui tentang hak cipta dan menghargai hak cipta suatu karya",
        "Mengetahui scope dalam JavaScript."
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Breaking News, Return, For Each",
      "objectives": [
        "Mengetahui cara bereaksi terhadap breaking news",
        "Memahami return statement dalam JavaScript",
        "Menggunakan looping dengan  for each"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Summary and Exam",
      "objectives": [
        "Review materi meeting 9-14",
        "Exam"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Exam",
      "objectives": [
        "Exam"
      ]
    }
  ],
  "Little Programmer": [
    {
      "num": 1,
      "title": "Lesson 1 - Variable in Truth or Dare",
      "objectives": [
        "Mengenal Cloud Storage",
        "Mengaplikasikan konsep Variable pada Micro:Bit"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - List of IOT",
      "objectives": [
        "Internet of Things untuk membantu kehidupan",
        "Mengenal List dalam coding"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Broadcast The Greeting Card",
      "objectives": [
        "Mengenal apa itu Broadcast dalam Coding",
        "Membuat animasi Greeting Card dengan kode Broadcast"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Digital Footprint in Line",
      "objectives": [
        "Memahami pengertian dari Jejak Digital",
        "Mengkombinasikan robot Maqueen dengan Micro:bit"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Community in Space",
      "objectives": [
        "Memahami komunitas dan perkembangannya",
        "Membuat animasi Lost in Space di Scratch"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Flying Game",
      "objectives": [
        "Berlatih membuat animasi di Scratch",
        "Membuat Flying Game dengan coding"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Virus in Item",
      "objectives": [
        "Mengenal Virus pada komputer dan cara mengatasinya",
        "Membuat game animasi menggunakan List"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Exam & Coding Test 1",
      "objectives": [
        "Written exam",
        "Coding Test"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Undersea Quiz in AR",
      "objectives": [
        "Mengingat kembali cara membuat AR",
        "Membuat quiz di dalam AR"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Wireless Operating System",
      "objectives": [
        "Mengenal apa itu Operating System",
        "Membuat coding Wireless Controller pada Micro:bit dan Maqueen"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Clone War Animation",
      "objectives": [
        "Belajar menggunakan Clone di Scratch",
        "Membuat animasi Clone War"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - World's Landmarks in AR",
      "objectives": [
        "Membuat AR tentang bangunan bersejarah di berbagai negara",
        "Mengetahui bangunan bersejarah di dunia"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Finishing My World's Landmarks",
      "objectives": [
        "Melanjutkan AR tentang bangunan bersejarah di berbagai negara",
        "Memberikan coding kepada karakter yang ada"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Addictive Design in The World",
      "objectives": [
        "Mengenal konsep Addictive Design",
        "Membuat game Create Your Own World - Part 1"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Continue making \"Create Your Own World\"",
      "objectives": [
        "Membuat game Create Your Own World - Part 2"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Exam & Coding Test 2",
      "objectives": [
        "Written exam",
        "Coding Test"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - AI in Python",
      "objectives": [
        "Mengenal apa itu kecerdasan buatan",
        "Mempelajari text coding dan bahasa Python"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Self Learning with Robot",
      "objectives": [
        "Internet sebagai sumber informasi dan tempat belajar",
        "Mengaplikasikan Operator & Variable pada Robot"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Soccer Game Part 1",
      "objectives": [
        "Menggunakan Scratch untuk membuat Soccer Game Part 1"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Soccer Game Part 2",
      "objectives": [
        "Melanjutkan membuat Soccer Game dengan Scratch",
        "Memainkan game yang telah dibuat"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Game Creation Part 1",
      "objectives": [
        "Menentukan ide untuk membuat game sendiri",
        "Mengumpulkan asset game"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Game Creation Part 2",
      "objectives": [
        "Membuat game sendiri",
        "Menyusun layout game dan coding start layout"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Game Creation Part 3",
      "objectives": [
        "Membuat game sendiri",
        "Menambahkan coding, life, score dan next level"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Game Creation Part 4",
      "objectives": [
        "Launch game",
        "Persiapan presentasi untuk pertemuan berikutnya"
      ]
    }
  ],
  "Python Coder": [
    {
      "num": 1,
      "title": "Lesson 1 - Intro to Python",
      "objectives": [
        "Mengenalkan Python dan aturan penggunaannya bahasanya",
        "Mengenalkan extension untuk mempermudah coding Python",
        "Mengetahui cara menampilkan hasil output dengan perintah print",
        "Mengetahui penulisan operator matematika dalam Python"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Variable and List in Python",
      "objectives": [
        "Mengenalkan konsep variable dan cara menggunakannya",
        "Mengenalkan perintah input untuk meminta respon dari user",
        "Mengenalkan jenis data types dalam python",
        "Mengenalkan konsep List dan cara menggunakannya",
        "Menggambar bentuk menggunakan Python Turtle"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Data Structure to Store Multiple Items",
      "objectives": [
        "Mengenalkan konsep data struktur dan tipenya",
        "Mengetahui cara mengolah data pada List, Tuple, dan Dictionary",
        "Mengenalkan konsep List 2 Dimensi dan cara menggunakannya",
        "Mengetahui cara memilih data secara acak dengan Random Module"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Doing Loops in Python",
      "objectives": [
        "Mengenalkan Loops untuk pembuatan coding",
        "Mengenalkan jenis dan perbedaan Loops (For, While) serta cara menggunakannya",
        "Mengenalkan pentingnya memberikan indentasi dalam penulisan coding",
        "Mengetahui penggunaan loops untuk mempersingkat penulisan coding"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Conditional and Conditional Loops",
      "objectives": [
        "Mengenalkan Konsep Conditional dan penggunaan if, elif, dan else untuk membuat kondisi",
        "Mengenalkan konsep dan penggunaan operator perbandingan dan logika dalam conditional",
        "Mengenalkan konsep case sensitive dengan lower sebagai solusinya",
        "Mengenalkan konsep conditional loops serta cara penggunaannya dengan While dan If"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Creating Function",
      "objectives": [
        "Mengenalkan konsep Function dan Jenis nya",
        "Mengetahui cara menggunakan built-in function",
        "Membuat manual function sendiri untuk fungsi tertentu"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - One-Liner, Scope, and Function Parameters",
      "objectives": [
        "Mengenalkan konsep penulisan coding one liner",
        "Mengenalkan konsep penulisan coding one liner",
        "Mengenalkan dan menggunakan function parameters dalam program"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Python Coder Middle Exam",
      "objectives": [
        "Middle Exam Python Coder - Form",
        "Middle Exam Python Coder - Fill The Blank Codes"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Object Oriented Programming (OOP)",
      "objectives": [
        "Mengenalkan Object Oriented Programming"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Intro to Python Module",
      "objectives": [
        "Mengenalkan dan mencoba Artificial Intelligence"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Intro to Python TKinter",
      "objectives": [
        "Mengenalkan dan menggunakan TKinter module",
        "Mengenalkan dan menggunakan komponen pada TKinter"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - TKinter Message and Input Box  with Label and Button",
      "objectives": [
        "Mengenalkan Message Boxes, Input Boxes, Labels, dan Buttons",
        "Mengetahui cara menggunakan Message Boxes, Input Boxes, Labels, dan Buttons"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - TKinter Canvas Coordinates",
      "objectives": [
        "Mengenalkan dan mempelajari cara menggunakan koordinat pada canvas"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - TKinter Mouse Events",
      "objectives": [
        "Memahami konsep events."
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Final Exam Python Coder Part 1",
      "objectives": [
        "Mengerjakan Google Form Exam"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Final Exam Python Coder Part 2",
      "objectives": [
        "Melanjutkan Final Exam"
      ]
    }
  ],
  "Python for AI": [
    {
      "num": 1,
      "title": "Lesson 1 - Introduction to AI and Machine Learning",
      "objectives": [
        "Mengetahui konsep Artificial Intelligence",
        "Mengetahui penerapan AI di kehidupan sehari-hari",
        "Mengetahui cakupan AI",
        "Mengetahui cara kerja Machine Learning"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - OOP (Object Oriented Programming)",
      "objectives": [
        "Memahami konsep OOP",
        "Membedakan Object, Class, Method, dan Property",
        "Mengetahui konsep inheritence di OOP",
        "Membuat game sederhana menggunakan OOP"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Tic Tac Toe With Numpy",
      "objectives": [
        "Menggunakan Numpy Library",
        "Membuat Numpy Array (1D, 2D, 3D) dan memanipulasinya",
        "Mengetahui Operasi Dasar pengolahan Numpy Array",
        "Membuat project TicTacToe menggunakan Numpy"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - OpenCV Image Manipulation",
      "objectives": [
        "Mengetahui konsep Computer Vision",
        "Menggunakan OpenCV Library",
        "Mengetahui konsep Image Processing",
        "Mengetahui teknik blurring menggunakan OpenCV",
        "Mengetahui Image Manipulation menggunakan OpenCV"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - OpenCV Color Processing and Cartoonizer Image",
      "objectives": [
        "Mengetahui image processing gray scale image di OpenCV",
        "Mengetahui konsep Canny Edge Detector dan Countour Detection",
        "Mengetahui cara mengidentifikasi warna di OpenCV",
        "Membuat project Image Cartoonize"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Face Detection",
      "objectives": [
        "Menggunakan Pre-trained model dan Machine Learning Framework",
        "Membuat aplikasi face detection di gambar",
        "Membuat aplikasi face detection di video"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - MobileNetSSD Object Detection",
      "objectives": [
        "Mengetahui arsitektur model Single Shot Detector (SSD)",
        "Dapat membuat project Object Detection menggunakan Model SSD",
        "Mengimplementasikan project object Detector baik itu di gambar atau di video"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Summary and Exam",
      "objectives": [
        "Review materi meeting 1 - 7",
        "Uji pemahaman Kognitif ( GForm Exam)",
        "Uji pemahaman coding (Coding exam)"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Object Detection VS Object Tracking",
      "objectives": [
        "Mengetahui konsep Object Tracking dan cara kerjanya",
        "Mengetahui perbedaan Object Detection dan Tracking",
        "Mengetahui konsep Euclidean Distance Tracker",
        "Mengetahui konsep countour detection",
        "Mengetahui konsep image thresholding"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Euclidean Distance Tracker Class",
      "objectives": [
        "Mengaplikasikan penggunaan Euclidean Distance Tracker Class",
        "Menambahkan Unique Identification dari object yang terdeteksi untuk proses tracking",
        "Menambahkan \"marker\" untuk object yang sedang di track"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Hand Landmarks Detection",
      "objectives": [
        "Pengenalan Mediapipe Library untuk landmark detection",
        "Menggunakana Mediapipe untuk Holistic Tracking",
        "Mendalami konsep Image Manipulation di Video Frames",
        "Membuat project Virtual Painter"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Find Landmark Position",
      "objectives": [
        "Mencari posisi landmark tangan menggunakan method enumerate()",
        "Mengetahui klasifikasi landmark pada tangan",
        "Menginisialisasi mode pada project Virtual Painter (Selection dan Drawing)",
        "Finishing project dengan teknis Video Frame Masking"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Mediapipe Face Mesh",
      "objectives": [
        "Mengetahui anatomi Face Mesh di Mediapipe",
        "Menggambar landmark menggunakan Face Mesh Landmark model",
        "Membuat project Pig Face Filter menggunakan Mediapipe"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Mediapipe Facial Area",
      "objectives": [
        "Mengetahui implementasi dari Face Mesh Landmark",
        "Mengetahui Facial Area yang ada di dalam Mediapipe",
        "Membuat project Face FIlter Dragon Project",
        "Membuat class Face Mesh untuk mendeteksi Facial Area"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Detect Mouth and Eye",
      "objectives": [
        "Mengidentifikasi apakah mulut terbuka atau tidak",
        "Mengidentifikasi nomor landmark pada facial mesh",
        "Melakukan Video masking untuk menempelkan efek filter ke dalam frames"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Final Exam",
      "objectives": [
        "Review Concept",
        "Uji pemahaman Kognitif ( GForm Exam)",
        "Uji pemahaman coding (Coding exam)"
      ]
    }
  ],
  "Python for Data Science": [
    {
      "num": 1,
      "title": "Lesson 1 - Introduction to AI and Python",
      "objectives": [
        "Pengenalan konsep Artificial Intelligence",
        "Pengenalan Python Programming",
        "Melakukan setup installation untuk Python",
        "Mengetahui syntax basic Python",
        "Memahami Variable / Datatype / Operator / Input menggunakan Python"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Python Data Structure",
      "objectives": [
        "Mempelajari Struktur Data dalam Python",
        "Memahami penggunaan Daftar (1D, 2D)",
        "Memahami metode untuk memanipulasi daftar",
        "Memahami penggunaan Tuples",
        "Membuat Proyek Pembuat Kata Sandi"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Dictionary",
      "objectives": [
        "Memahami konsep dictionary",
        "Mengetahui cara membuat dictionary dan metode yang digunakan dalam dictionaries",
        "Menggabungkan beberapa struktur data menjadi satu",
        "Membuat proyek Dictionary Film"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Looping in Python",
      "objectives": [
        "Memahami konsep looping",
        "Memahami contoh penggunaan loops for dalam Python",
        "Memahami contoh penggunaan loops while di Python",
        "Teknik looping satu baris",
        "Looping exercise"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Condition in Python",
      "objectives": [
        "Memahami konsep conditions dalam Python",
        "Memahami konsep conditions disi bersarang di Python",
        "Menggabungkan conditions dengan perulangan",
        "Membuat Proyek Jumbled Word"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Function in Chatbot",
      "objectives": [
        "Memahami functions  dalam Python",
        "functions bawaan dalam Python",
        "functions yang ditentukan pengguna dalam Python",
        "Scope rules di Python",
        "Membuat Chatbot Discord menggunakan Discord.py"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Object Oriented Programming (OOP)",
      "objectives": [
        "Memahami konsep OOP",
        "Membedakan Object, Class, Method, dan Property",
        "Memahami konsep inheritance dalam OOP",
        "Membuat game sederhana menggunakan OOP"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Summary and Middle Exam",
      "objectives": [
        "Review Concepts",
        "Middle Exam"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Sorting and Searching Algorithm",
      "objectives": [
        "Konsep Sorting",
        "Memahami bagaimana bubble sort dan insertion sort algorithms work",
        "Menerapkan code untuk bubble sort and insertion sort algorithms",
        "Memahami cara kerja algorithm pencarian linear",
        "Menerapkan kode untuk algorithm pencarian linier"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Python Libraries and Numpy",
      "objectives": [
        "Memahami apa itu Python libraries dan contoh-contohnya",
        "Memahami cara memasang Python libraries",
        "Menggunakan Numpy library",
        "Membuat Numpy arrays (1D, 2D, 3D) dan memanipulasinya",
        "Membuat  TicTacToe project menggunakan Numpy"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Pandas data frame",
      "objectives": [
        "Memahami data dan jenis data",
        "Memahami pentingnya data",
        "Memahami mekanisme pengumpulan data",
        "Pengenalan alat bantu pemrosesan data (Google Colab)",
        "Memahami cara memanipulasi dataframe menggunakan pandas"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Analyze the Data",
      "objectives": [
        "Memahami cara mendefinisikan pertanyaan bisnis",
        "Memahami alur analisis data",
        "Membuat proyek analisis data e-commerce",
        "Memahami mekanisme penilaian data",
        "Memahami mekanisme pembersihan data"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Exploratory data analysis",
      "objectives": [
        "Memahami tahapan data analysis eksploratori (EDA) dalam data analysis",
        "Menerapkan teknik pengelompokan data",
        "Memahami konsep data visualization yang efektif",
        "Mengetahui cara mengubah set data",
        "Menjawab pertanyaan bisnis"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Probability",
      "objectives": [
        "Memahami hubungan antara  probability dan artificial intelligence",
        "Memahami konsep dasar probability",
        "Memecahkan masalah probability sederhana seperti koin dan dadu",
        "Memahami konsep distribusi",
        "Memecahkan masalah ulang tahun"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Review materials & Final Exam",
      "objectives": [
        "Review materials",
        "Written Exam",
        "Coding Exam - Part 1"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Finishing the Exam",
      "objectives": [
        "Coding Exam - Part 2",
        "Coding Exam submission"
      ]
    }
  ],
  "Python Game Developer": [
    {
      "num": 1,
      "title": "Lesson 1 - Introduction to Pygame",
      "objectives": [
        "Memperkenalkan konsep terkait Game Development test",
        "Mengetahui bagaimana mendevelop game menggunakan Pygame",
        "Mengetahui bagaimana cara setting environtment di Pygame",
        "Mengetahui bagaimana konsep event controller bekerja",
        "Mengetahui bagaimana cara menambahkan object di dalam Pygame"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Add Another Sprite for Snake Game",
      "objectives": [
        "Mengetahui bagaimana cara inisialisasi FPS di dalam Pygame",
        "Menambahkan object lain ke dalam Pygame canvas",
        "Mengetahui bagaimana cara berpindah layout dalam Pygame",
        "Mengetahui apa fungsi FPS dalam Game Development",
        "Mengetahui list operational dalam Python",
        "Mengetahui cara menambahkan text ke dalam layout Pygame"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Load Image Sprite in Astro Man",
      "objectives": [
        "Mengetahui functional programming style (modular dan reusable)",
        "Membuat screen menggunakan function",
        "Mengetahui management folder di dalam Pygame",
        "Mengetahui bagaimana cara load assets di Pygame",
        "Mengetahui bagaimana cara render gambar di Pygame",
        "Mengetahui cara load dan play sound effect"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Spawn The Pipe",
      "objectives": [
        "Mengetahui Gravity Concept dalam game",
        "Mengetahui perbedaan Velocity dan Acceleration",
        "Dapat menggerakan object secara static",
        "Remove object from the Window"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Create Collide Event",
      "objectives": [
        "Mengetahui bagaimana cara kerja collide sprite lebih complex",
        "Mengetahui kondisi collide dalam game dan dikemas dalam sebuah function",
        "Mengetahui bagaimana cara akses global variabel",
        "Mengetahui bagaimana cara setting high score di dalam Game"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Multiplayer Space Shooter",
      "objectives": [
        "Review ulang materi syntax penting yang biasa digunakan dalam Python Game Development",
        "Mengenal konsep multiplayer game",
        "Mengenal macam-macam fungsi tranform pada Pygame",
        "Memperdalam terkait function scale and rotate dalam pygame"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Spawn the Bullet and Make the Ship Move",
      "objectives": [
        "Lebih mendalami Behavior pygame.Rect() !",
        "Mendalami konsep velocity untuk membuat object bergerak",
        "Memahami konsep method pygame.key.get_pressed()",
        "Membuat kode menjadi lebih modular dengan memecar program menjadi beberapa function"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Finishing the Space Shooter !",
      "objectives": [
        "Memahami cara membuat custom event or user event di dalam Pygame",
        "Memahami bagaimana menerima broadcast user event atau custom event di dalam Pygame",
        "Memahami cara membuat winning screen game !",
        "Mengetahui cara Convert Pygame menjadi executable file"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Runner Game",
      "objectives": [
        "Memahami konsep dan terminologi animation secara umum",
        "Memahami bagaimana membuat animation sprite di Pygame",
        "Menambahkan font external ke dalam Pygame",
        "Mengetahui function time() lebih lanjut"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Spawn The Enemy",
      "objectives": [
        "Mendalami lebih dalam terkait gravitasi dalam game",
        "Mengimplementasikan animation frame untuk sprite yang lebih banyak",
        "Memahami pengkondisian ketika melakukan spawing object atau enemy",
        "Menambahkan background sound ke dalam game"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Publish your game",
      "objectives": [
        "Explorasi ide untuk project mandiri",
        "Mengumpulkan assets untuk project mandiri",
        "Membuat timeline development game",
        "Mempersiapkan folder environtment untuk project"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Create your own game",
      "objectives": [
        "Explorasi ide untuk project mandiri",
        "Mengumpulkan assets untuk project mandiri",
        "Membuat timeline development game",
        "Mempersiapkan folder environtment untuk project"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Create your own game (Explore)",
      "objectives": [
        "Melanjutkan progress development project",
        "Design Screen untuk project mandiri",
        "Review Coordinates System di Pygame",
        "Menambahkan sprite ke dalam game"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Create Your Own Game (Coding the Logic )",
      "objectives": [
        "Melanjutkan progress development project",
        "Coding Logic untuk Game",
        "Membuat sprite bergerak",
        "Menambahkan enemies untuk game"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Create Your Own Game (Finishing and Build Your Project)",
      "objectives": [
        "Testing and Debugging",
        "Mendefinisikan Game Over Condition",
        "Presentasi dan Revisi project",
        "Finishing project"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - CreateYour Own Game (Build and Publish your Game)",
      "objectives": [
        "Build game menjadi executable file",
        "Publish the game"
      ]
    }
  ],
  "Virtual World Maker": [
    {
      "num": 1,
      "title": "Lesson 1 - Recall Algorithm in Coding",
      "objectives": [
        "Mengingat kembali Coding sebagai bahasa komputer",
        "Berlatih membuat coding sesuai algoritma yang benar"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Event While Screen Time",
      "objectives": [
        "Memahami pengaruh Screen Time dan Gadget Addiction",
        "Mengingat kembali apa itu Event dalam Coding"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Cyber Bullying & Loop",
      "objectives": [
        "Mencegah dan mengatasi Cyber Bullying",
        "Mengingat kembali apa itu Loop dalam coding"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Introduction to Another Scratch",
      "objectives": [
        "Belajar membuat animasi di Scratch",
        "Mengeksplor bagian-bagian di Scratch"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - Conditions When with Astronaut",
      "objectives": [
        "Mengingat kembali konsep Conditional dalam Coding",
        "Berlatih menggerakkan karakter dengan code If"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Media Balance with Robot",
      "objectives": [
        "Belajar pentingnya Media Balance",
        "Memprogram robot dengan platform baru"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Message In The Sky",
      "objectives": [
        "Mengetahui perbedaan komunikasi langsung dengan online",
        "Mengenal dan mengendalikan Drone secara virtual"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Exam & Coding Test 1",
      "objectives": [
        "Written Exam",
        "Coding Test"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Hunting Bug",
      "objectives": [
        "Mengetahui Bug pada suatu program",
        "Membuat Bug Hunter game menggunakan konsep Conditional"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - Gliding Beetle",
      "objectives": [
        "Menggunakan \"Glide\" untuk menggerakkan sprite",
        "Membuat Beetle Race Game di Scratch"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Function of Copyright",
      "objectives": [
        "Mengingat kembali tentang Copyright",
        "Mengaplikasikan kode Function di coding game"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - Function in Robot",
      "objectives": [
        "Mengingat kembali apa itu Function dalam coding",
        "Mengimplementasikan konsep Function pada Robot"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Never Give Up On Conditional Loop",
      "objectives": [
        "Pentingnya tetap berusaha & pantang menyerah",
        "Mengenal Conditional Loop dalam coding"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Spamming Forever",
      "objectives": [
        "Mengenal Spam dan cara menghindarinya",
        "Menggunakan kode Forever dalam coding"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Program The Micro:bit",
      "objectives": [
        "Mengetahui apa itu Micro:bit",
        "Belajar memprogram Micro:bit dengan kode Forever"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Exam & Coding Test 2",
      "objectives": [
        "Written Exam",
        "Coding Test"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Virtual Animal Exhibition",
      "objectives": [
        "Mengingat kembali apa itu Virtual Reality (VR)",
        "Membuat pameran hewan dengan VR"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - Function in Virtual Reality",
      "objectives": [
        "Menggunakan function dalam VR",
        "Membuat VR \"Finding Animal\""
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Variable in Technology Development",
      "objectives": [
        "Perkembangan teknologi dalam kehidupan manusia",
        "Mengenal Variable dalam coding"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Travelling with Technology",
      "objectives": [
        "Mengenal aplikasi untuk membantu dalam perjalanan",
        "Membuat VR City Tour"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Math Operator in Coding",
      "objectives": [
        "Mengenal Operator dalam coding",
        "Mengaplikasikan kode Operator ke dalam Math Game"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Hoax in Multiple Diorama part 1",
      "objectives": [
        "Mengenal Hoax dan cara menghindarinya",
        "Membuat multiple diorama dalam VR"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Multiple Diorama Part 2",
      "objectives": [
        "Melanjutkan project multiple diorama sebelumnya",
        "Mempresentasikan Solar System VR"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Exam & Coding Test 3",
      "objectives": [
        "Written Exam",
        "Coding Test"
      ]
    }
  ],
  "Web Developer Teens": [
    {
      "num": 1,
      "title": "Lesson 1 - Intro to Website and HTML",
      "objectives": [
        "Pengenalan Website",
        "Pengenalan HTML",
        "Memahami tag Heading, Paragraf, Break, Bold, Italic, Underline dalam HTML"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Intro to CSS and Header",
      "objectives": [
        "Pengenalan CSS (Cascading Style Sheet)",
        "CSS Box Model dan komponennya",
        "Memahami konsep selector pada CSS",
        "Menerapkan CSS untuk membuat dan menata bagian header pada website"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - Styling Images",
      "objectives": [
        "Memahami dan menerapkan display flex dalam tata letak website",
        "Mempelajari teknik efektif untuk menata gambar pada website",
        "Menambahkan cards untuk product pada website"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - How About Table in HTML?",
      "objectives": [
        "Memahami struktur tabel dalam HTML.",
        "Memahami atribut Colspan dan Rowspan dalam tabel HTML.",
        "Menambahkan tabel ke website."
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - List and Button on Pricing Table",
      "objectives": [
        "Memahami dan menerapkan List dalam HTML",
        "Mempelajari cara membuat button dalam HTML",
        "Menambahkan pricing table di website"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - Link in HTML and About Us Section",
      "objectives": [
        "Memahami konsep link termasuk Hyperlink dan Anchor Link",
        "Memahami perbedaan Absolute dan Relative URL",
        "Menambahkan halaman About Us pada website"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Awesome Footer",
      "objectives": [
        "Mempelajari konsep menambah icon dengan Font Awesome",
        "Menambahkan footer dengan gradient color pada website"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Middle Test and Responsive Website",
      "objectives": [
        "Menerapkan Google Font dalam website",
        "Mempelajari prinsip responsive website",
        "Mengunggah situs web ke internet"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Intro JavaScript dan HTML DOM",
      "objectives": [
        "Pengenalan JavaScript dalam Dokumen HTML",
        "Memahami HTML DOM (Document Object Model)",
        "Bekerja dengan Metode DOM",
        "Membuat Halaman Blog dengan JavaScript dan HTML"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - DOM Events",
      "objectives": [
        "Memahami konsep event pada DOM",
        "Mulai membuat project website Blog"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - Add Media and Project Page",
      "objectives": [
        "Menambahkan elemen video dan audio ke  HTML5",
        "Menyematkan konten media eksternal",
        "Melanjutkan pembuatan website"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - HTML Form",
      "objectives": [
        "Mempelajari  HTML Form untuk interaksi pengguna",
        "Form Elements : Form, Input, Label, Text Area, dan Select tag",
        "Form Attributes di HTML",
        "Membuat website formulir"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - Input Types and Attribute",
      "objectives": [
        "Menjelajahi Jenis Tag Input",
        "Memahami Atribut Input",
        "Melanjutkan Formulir Halaman Web"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Styling Form",
      "objectives": [
        "Menambahkan CSS pada Form",
        "Kirimkan data formulir ke Email",
        "Melanjutkan Website"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Submit to Email and Create Modal",
      "objectives": [
        "Mengsubmmit  data form ke email",
        "Membuat Modal dengan HTML,CSS, dan JavaScript",
        "Melanjutkan Website"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Image Slider Using For Each",
      "objectives": [
        "Membuat Manual dan Autoplay Image Sliders",
        "Memahami metode forEach",
        "Cek pemahaman 2"
      ]
    },
    {
      "num": 17,
      "title": "Lesson 17 - Exploring Tools and Create About Page",
      "objectives": [
        "Menjelajahi tools untuk membuat Blob, Background, dan Waves",
        "Melanjutkan Website"
      ]
    },
    {
      "num": 18,
      "title": "Lesson 18 - CSS Transition and Animation",
      "objectives": [
        "Mempelajari transisi dan animasi CSS",
        "Mengetahui perbedaan antara transisi dan animasi",
        "Mengimplementasikan reveal on scroll"
      ]
    },
    {
      "num": 19,
      "title": "Lesson 19 - Responsive Website",
      "objectives": [
        "Membuat responsive website"
      ]
    },
    {
      "num": 20,
      "title": "Lesson 20 - Create Your Own Website",
      "objectives": [
        "Mengetahui proses development",
        "Memilih tipe website yang akan dibuat",
        "Membuat design website"
      ]
    },
    {
      "num": 21,
      "title": "Lesson 21 - Create Your Own Website",
      "objectives": [
        "Mempersiapkan Struktur Project",
        "Membuat Header, Footer, dan Home page"
      ]
    },
    {
      "num": 22,
      "title": "Lesson 22 - Create Your Own Website",
      "objectives": [
        "Membuat Halaman Detail dan Halaman about page"
      ]
    },
    {
      "num": 23,
      "title": "Lesson 23 - Create Your Own Website",
      "objectives": [
        "Membuat Halaman Kontak",
        "Membuat Website Lebih Responsif"
      ]
    },
    {
      "num": 24,
      "title": "Lesson 24 - Create Your Own Website",
      "objectives": [
        "Deploy Situs Web ke Netlify",
        "Presentasi"
      ]
    }
  ],
  "Website Designer": [
    {
      "num": 1,
      "title": "Lesson 1 - What is Conditional Loop?",
      "objectives": [
        "Belajar konsep Conditional Loop dalam coding",
        "Menggerakkan robot dengan coding"
      ]
    },
    {
      "num": 2,
      "title": "Lesson 2 - Introduction To Virtual Reality",
      "objectives": [
        "Mengetahui apa itu Virtual Reality (VR)",
        "Belajar membuat VR dengan Delightex"
      ]
    },
    {
      "num": 3,
      "title": "Lesson 3 - My Virtual City in Delightex",
      "objectives": [
        "Berlatih membuat Virtual Reality",
        "Membuat kota virtual di Delightex"
      ]
    },
    {
      "num": 4,
      "title": "Lesson 4 - Function in Robot",
      "objectives": [
        "Belajar konsep Function dalam coding",
        "Menggerakkan robot dengan konsep Function"
      ]
    },
    {
      "num": 5,
      "title": "Lesson 5 - What is AR?",
      "objectives": [
        "Mengetahui apa itu Augmented Reality (AR)",
        "Belajar mendesain AR dengan Delightex"
      ]
    },
    {
      "num": 6,
      "title": "Lesson 6 - My Virtual House",
      "objectives": [
        "Latihan membuat Virtual Reality",
        "Membuat rumah virtual di Delightex"
      ]
    },
    {
      "num": 7,
      "title": "Lesson 7 - Final Virtual Reality Project",
      "objectives": [
        "Membuat project akhir Virtual Reality dengan Delightex"
      ]
    },
    {
      "num": 8,
      "title": "Lesson 8 - Overview & Challenge",
      "objectives": [
        "Review materi Lesson 1-7",
        "Coding Challenge 1"
      ]
    },
    {
      "num": 9,
      "title": "Lesson 9 - Design the Aquarium in AR",
      "objectives": [
        "Berlatih membuat desain & coding AR",
        "Membuat AR aquarium dengan Delightex"
      ]
    },
    {
      "num": 10,
      "title": "Lesson 10 - My Cube Profile Project 1",
      "objectives": [
        "Memulai project akhir AR",
        "Mendesain project \"All about me\" di Delightex"
      ]
    },
    {
      "num": 11,
      "title": "Lesson 11 - My Cube Profile Project 2",
      "objectives": [
        "Menyelesaikan project akhir AR"
      ]
    },
    {
      "num": 12,
      "title": "Lesson 12 - How to make a Website?",
      "objectives": [
        "Mengenal apa itu Website",
        "Belajar membuat Website sederhana"
      ]
    },
    {
      "num": 13,
      "title": "Lesson 13 - My Final Website Project",
      "objectives": [
        "Mulai mengerjakan project akhir Website",
        "Menambahkan layout biodata & project"
      ]
    },
    {
      "num": 14,
      "title": "Lesson 14 - Continue My Final Website Project",
      "objectives": [
        "Melanjutkan project akhir Website",
        "Menambahkan halaman ke dalam Website"
      ]
    },
    {
      "num": 15,
      "title": "Lesson 15 - Buttons on My Website",
      "objectives": [
        "Melanjutkan project Website",
        "Menambahkan button pada Website"
      ]
    },
    {
      "num": 16,
      "title": "Lesson 16 - Prepare The Presentation!",
      "objectives": [
        "Menyelesaikan dan menerbitkan website",
        "Membuat presentasi project"
      ]
    }
  ]
};

const COURSE_MAP = {
  "Junior": [
    "3D ANIMATOR",
    "Website Designer",
    "Virtual World Maker",
    "Little Programmer"
  ],
  "Kids": [
    "Coding Explorer",
    "Tech Explorer",
    "Game Developer",
    "Code and Design with Roblox",
    "Interactive Mechanics on Roblox",
    "Full Stack Programming on Roblox",
    "Adcanced Lua Programming on Roblox"
  ],
  "Teens": [
    "AI Computer Vision",
    "Python for Data Science",
    "AI Machine Learning",
    "JavaScript Developer",
    "Web Developer Teens",
    "Android Developer",
    "Python for AI",
    "Python Game Developer",
    "Python Coder"
  ]
};

// English templates — friendly language for parents (non-native teachers)

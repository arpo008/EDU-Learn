<?php
session_start();
if (!isset($_SESSION['userdata'])) {
  header('Location: login.php');
  exit();
}
$user = $_SESSION['userdata'];
if (isset($_GET['logout'])) {
  session_unset();
  session_destroy();
  header('Location: login.php');
  exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <title>EduLearn Dashboard</title>
  <style>
    body { background-color: #f0f8ff; }
    .dashboard-header { background-color: #007bff; color: white; padding: 20px; }
    .logout-btn { position: absolute; top: 20px; right: 20px; z-index: 1000; }
    .video-section iframe { width: 100%; height: 300px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <a href="?logout=true" class="btn btn-danger btn-sm logout-btn">Logout</a>

  <div class="dashboard-header text-center">
    <h2>Welcome to EduLearn Dashboard</h2>
    <p>
      <strong>Name:</strong> <?php echo $user['name']; ?> |
      <strong>Email:</strong> <?php echo $user['email']; ?>
    </p>
  </div>

  <div class="container mt-4">
    <form id="searchForm" class="mb-3">
      <div class="input-group">
        <input type="text" id="query" class="form-control" placeholder="e.g. photosynthesis" required>
        <button class="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
    <div id="response" class="mb-3"></div>
    <div id="segments" class="video-section mt-3"></div>
    <div id="resources" class="video-section mt-3"></div>
  </div>

  <script>
    //  Insert your API keys here
    const OPENAI_API_KEY = "your own api";
    const YOUTUBE_API_KEY = "your own api";

    // Predefined split segments
    const segmentMap = {
      //class 6
      //science 
      "thermal energy": { videoId: "n3boAYB7T3k", start: 53, end: 144 },
      "temperature": { videoId: "n3boAYB7T3k", start: 135, end: 268 },
      "heat": { videoId: "n3boAYB7T3k", start: 268, end: 350 },
      //math
      "fraction to decimal": { videoId: "Gn2pdkvdbGQ", start: 0, end: 150 },
      "improper fraction": { videoId: "Gn2pdkvdbGQ", start: 151, end: 260 },
      "decimal": { videoId: "Gn2pdkvdbGQ", start: 260, end: 394 },
      "fraction": { videoId: "Gn2pdkvdbGQ", start: 395, end: 560 },
      // English aspect parts of speech
      "introduction aspect": { videoId: "_JXcMl8Hqjo", start: 0, end: 14 },
      "simple aspect": { videoId: "_JXcMl8Hqjo", start: 15, end: 57 },
      "present": { videoId: "_JXcMl8Hqjo", start: 58, end: 91 },
    
      // class 7
      //science 
      "plant and animal": { videoId: "6dub9UGH10Y", start: 0, end: 43 },
      "fungi": { videoId: "6dub9UGH10Y", start: 44, end: 140 },
      "protista": { videoId: "6dub9UGH10Y", start: 141, end: 219 },
      "monera": { videoId: "6dub9UGH10Y", start: 141, end: 296 },
      "eukaryotic vs prokaryotic": { videoId: "6dub9UGH10Y", start: 297, end: 365 },
      "protista": { videoId: "6dub9UGH10Y", start: 365, end: 412 },
      //math
      "variables": { videoId: "vDqOoI-4Z6M", start: 0, end: 99 },
      "expression": { videoId: "vDqOoI-4Z6M", start: 100, end: 154 },
      "equation": { videoId: "vDqOoI-4Z6M", start: 154, end: 414 },
     
    
      //senetense
      "introduction sentense": { videoId: "ld8r6NGXRts", start: 0, end: 30 },
      "declarative": { videoId: "ld8r6NGXRts", start: 31, end: 84 },
      "interogative": { videoId: "ld8r6NGXRts", start: 85, end: 130 },
      "imperative": { videoId: "ld8r6NGXRts", start: 131, end: 210 },


      // class 8
      //science 
      "introduction to respiration": { videoId: "2f7YwCtHcgk", start: 0, end: 112 },
      "cellular respiration": { videoId: "2f7YwCtHcgk", start: 113, end: 235 },
      "glucolysis": { videoId: "2f7YwCtHcgk", start: 236, end: 857 },
     
      //math
      "unit in 1d": { videoId: "xMz9WFvox9g", start: 0, end: 85 },
      "unit in 2d": { videoId: "xMz9WFvox9g", start: 86, end: 252 },
      "unit in 3d": { videoId: "xMz9WFvox9g", start: 253, end: 466 },
     
    
      //modals
      "modality": { videoId: "hp9T-7on2Ow", start: 0, end: 40 },
      "modal verbs": { videoId: "hp9T-7on2Ow", start: 41, end: 137 },
      "use of must": { videoId: "hp9T-7on2Ow", start: 138, end: 188 },
      "use of may": { videoId: "hp9T-7on2Ow", start: 189, end: 290 }

    };

    document.getElementById('searchForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const q = document.getElementById('query').value.trim().toLowerCase();
      const responseDiv = document.getElementById('response');
      const segmentsDiv = document.getElementById('segments');
      const resourcesDiv = document.getElementById('resources');

      responseDiv.innerHTML = `<div class="alert alert-info">Processing your question: <em>${q}</em>...</div>`;
      segmentsDiv.innerHTML = '';
      resourcesDiv.innerHTML = '';

      //  Call OpenAI for explanation
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + OPENAI_API_KEY
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: q }],
            max_tokens: 300
          })
        });
        const data = await res.json();
        const explanation = data.choices[0].message.content;
        responseDiv.innerHTML = `<div class="alert alert-success"><strong>Explanation:</strong> ${explanation}</div>`;
      } catch (err) {
        responseDiv.innerHTML = '<div class="alert alert-danger">Failed to load explanation.</div>';
      }

      //  If query matches a split segment, show that segment
      const key = Object.keys(segmentMap).find(k => q.includes(k));
      if (key) {
        const { videoId, start, end } = segmentMap[key];
        const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}&autoplay=0&rel=0&modestbranding=1`;
        segmentsDiv.innerHTML = `
          <h5>Segment: ${key}</h5>
          <iframe src="${embedUrl}" title="${key}" allowfullscreen></iframe>
        `;
      } else {
        //  Otherwise search Khan Academy channel for full videos
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=2&channelId=UC4a-Gbdw7vOaccHmFo40b9g`)
          .then(res => res.json())
          .then(data => {
            if (data.items && data.items.length > 0) {
              const videoHTML = data.items.map(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                return `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1" title="${title}" allowfullscreen></iframe>`;
              }).join('');
              resourcesDiv.innerHTML += `<h5>Khan Academy YouTube Videos:</h5>${videoHTML}`;
            } else {
              resourcesDiv.innerHTML += `<p>No Khan Academy videos found for this topic.</p>`;
            }
          })
          .catch(error => {
            resourcesDiv.innerHTML += `<p class="text-danger">❌ Failed to load YouTube videos.</p>`;
          });
      }

      //  Always provide Khan Academy link
      const khanLink = `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(q)}`;
      resourcesDiv.innerHTML += `
        <div class="mt-3">
          <h5>More Khan Academy Resources:</h5>
          <p>🔗 <a href="${khanLink}" target="_blank">View Khan Academy search results for "${q}"</a></p>
        </div>
      `;
    });
  </script>
</body>
</html>
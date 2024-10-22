document.addEventListener('DOMContentLoaded', () => {
      const burnInHellBox = document.getElementById('burnInHellBox');
      const savedBox = document.getElementById('savedBox');
      const score = document.getElementById('score');
      const unsavedCountElement = document.getElementById('unsavedCount');
      const backgroundMusic = document.getElementById('backgroundMusic');
      const controlButton = document.getElementById('startButton'); // game start & pause button
      let savedCount = 0;
      let pikachuCount = 0;
      let unsavedCount = 0;
      // Initial Pikachu spawn interval
      let spawnInterval = 1000; // Initial interval in milliseconds
      const intervalDecrement = 35; // Decrease interval by 35ms each time
      const minInterval = 200; // Minimum interval to prevent it from becoming too fast
      let spawnIntervalId; // Declare spawnIntervalId without initializing
      let gameRunning = false; // Track whether the game is running

      // Pikachu images and spawn sounds 
      const pikachuImages = ['images/p1.jpg', 'images/p2.jpg', 'images/p3.png'];
      const spawnSounds = ['audio/pika_voice.ogg', 'audio/pika_voice2.mp3', 'audio/pika_voice3.mp3'];
      const dropSound = 'audio/Pikaaa.mp3';

      function playSound(soundArray) {
            const sound = new Audio(soundArray[Math.floor(Math.random() * soundArray.length)]);
            sound.play();
      }

      function spawnPikachu() {
            const pikachu = document.createElement('div');
            pikachu.classList.add('pikachu');
            pikachu.draggable = true;
            pikachu.id = `pikachu-${pikachuCount}`;

            // Randomly select a Pikachu image
            const randomImage = pikachuImages[Math.floor(Math.random() * pikachuImages.length)];
            pikachu.style.backgroundImage = `url(${randomImage})`;

            burnInHellBox.appendChild(pikachu);

            // Calculate random position within burnInHellBox
            const maxX = burnInHellBox.offsetWidth - 60;  // 60 is pikachu width
            const maxY = burnInHellBox.offsetHeight - 60;

            pikachu.style.position = 'absolute';
            pikachu.style.left = `${Math.floor(Math.random() * maxX)}px`;
            pikachu.style.top = `${Math.floor(Math.random() * maxY)}px`;

            pikachu.addEventListener('dragstart', dragStart);

            // Play spawn sound
            playSound(spawnSounds);

            pikachuCount++;
            unsavedCount++;
            unsavedCountElement.textContent = `남은 피카츄 : ${unsavedCount}`;

            // if the player fails to save the pikachu in time
            if (unsavedCount > 30) {
                  alert("당신은 남은 피카츄들을 구하지 못했습니다. 그렇게 그들은 모두 불타버렸습니다...May the pikachus rest in peace...😢");
                  resetGame();
            }
      }

      function resetGame() {
            burnInHellBox.innerHTML = '';
            savedBox.innerHTML = '';
            savedCount = 0;
            pikachuCount = 0;
            unsavedCount = 0;
            score.textContent = `구출된 피카츄 : ${savedCount}`;
            unsavedCountElement.textContent = `남은 피카츄 : ${unsavedCount}`;
            spawnInterval = 1000; // Reset the interval
            clearInterval(spawnIntervalId);
            spawnIntervalId = setInterval(spawnPikachu, spawnInterval);
            backgroundMusic.pause(); // Pause the background music
            backgroundMusic.currentTime = 0; // Reset the background music to the beginning
            controlButton.textContent = '게임 시작';
            gameRunning = false;
      }

      function dragStart(e) {
            if (!gameRunning) {
                  e.preventDefault();
                  return;
            }
            e.dataTransfer.setData('text/plain', e.target.id);
            e.target.classList.add('dragging');
      }

      burnInHellBox.addEventListener('dragover', (e) => {
            if (!gameRunning) {
                  e.preventDefault();
                  return;
            }
            e.preventDefault();
      });

      savedBox.addEventListener('dragover', (e) => {
            if (!gameRunning) {
                  e.preventDefault();
                  return;
            }
            e.preventDefault();
      });

      savedBox.addEventListener('drop', (e) => {
            if (!gameRunning) {
                  e.preventDefault();
                  return;
            }
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const pikachu = document.getElementById(id);

            if (pikachu) {
                  // Remove dragging class
                  pikachu.classList.remove('dragging');

                  // Reset position styles for saved box
                  pikachu.style.position = 'static';
                  pikachu.style.left = '';
                  pikachu.style.top = '';

                  // Move to saved box
                  savedBox.appendChild(pikachu);

                  // Play drop sound
                  const sound = new Audio(dropSound);
                  sound.play();

                  // Update score
                  savedCount++;
                  unsavedCount--;
                  score.textContent = `구출된 피카츄 : ${savedCount}`;
                  unsavedCountElement.textContent = `남은 피카츄 : ${unsavedCount}`;
            }
      });

      // Function to gradually decrease the spawn interval
      function decreaseInterval() {
            if (spawnInterval > minInterval) {
                  spawnInterval -= intervalDecrement;
                  clearInterval(spawnIntervalId);
                  spawnIntervalId = setInterval(() => {
                        spawnPikachu();
                        decreaseInterval();
                  }, spawnInterval);
            }
      }
      ////////////////////////////////////////////////////////
      // Initial spawn interval
      // let spawnIntervalId = setInterval(() => {
      //       spawnPikachu();
      //       decreaseInterval();
      // }, spawnInterval);
      ////////////////////////////////////////////////////////

      // Start or pause game when the control button is clicked
      controlButton.addEventListener('click', () => {
            if (gameRunning) {
                  // Pause the game
                  clearInterval(spawnIntervalId);
                  backgroundMusic.pause();
                  controlButton.textContent = '게임 시작';
                  gameRunning = false;
            } else {
                  // Start or resume the game
                  backgroundMusic.play();
                  spawnIntervalId = setInterval(() => {
                        spawnPikachu();
                        decreaseInterval();
                  }, spawnInterval);
                  controlButton.textContent = '일시 정지';
                  gameRunning = true;
            }
      });
});
/**
 * Jigsaw Master - Core Game Logic & Bézier Jigsaw Engine
 * Pure Vanilla JavaScript & HTML5 Canvas
 */

(function () {
  'use strict';

  // --- Sound Effects Synthesizer (Web Audio API) ---
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playSnap() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High-pitch wooden click & tactile pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    }

    playPickup() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    }

    playRotate() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    }

    playWiggle() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    }

    playHint() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      });
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      // Victory fanfare arpeggio
      const chord = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
      chord.forEach((freq, i) => {
        const now = this.ctx.currentTime + i * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + (i === chord.length - 1 ? 0.8 : 0.4));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.0);
      });
    }
  }

  // --- Confetti & Fireworks Celebration Particle Engine ---
  class ConfettiEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.colors = ['#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ffffff', '#3b82f6'];
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    start() {
      this.resize();
      this.particles = [];
      const particleCount = 160;

      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: this.canvas.width * 0.5 + (Math.random() - 0.5) * 200,
          y: this.canvas.height * 0.6,
          vx: (Math.random() - 0.5) * 22,
          vy: -Math.random() * 20 - 8,
          size: Math.random() * 8 + 6,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 12,
          shape: Math.random() > 0.4 ? 'rect' : 'circle',
          alpha: 1
        });
      }

      cancelAnimationFrame(this.animId);
      this.loop();
    }

    stop() {
      cancelAnimationFrame(this.animId);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles = [];
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let alive = false;
      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.vRot;

        if (p.y > this.canvas.height - 20) {
          p.alpha -= 0.02;
        }

        if (p.alpha > 0) {
          alive = true;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = Math.max(0, p.alpha);
          this.ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
          }
          this.ctx.restore();
        }
      }

      if (alive) {
        this.animId = requestAnimationFrame(() => this.loop());
      }
    }
  }

  // --- Jigsaw Engine Class ---
  class JigsawGame {
    constructor() {
      // Configuration
      this.gridSize = 4; // 3, 4, 5, 6
      this.currentImageSrc = 'assets/japanese_garden.svg';
      this.sourceImage = null;

      // Board Dimensions
      this.boardWidth = 640;
      this.boardHeight = 480;
      this.pieceWidth = 0;
      this.pieceHeight = 0;
      this.tabSize = 0;
      this.padding = 0;

      // Game States
      this.pieces = [];
      this.snappedCount = 0;
      this.totalPieces = 0;
      this.movesCount = 0;
      this.timerInterval = null;
      this.secondsElapsed = 0;
      this.isGameActive = false;
      this.ghostEnabled = true;
      this.rotationEnabled = true; // Chế độ xoay góc ngẫu nhiên ban đầu
      this.activeTrayFilter = 'all'; // 'all', 'edge', 'inner'

      // DOM Elements
      this.dom = {
        boardContainer: document.getElementById('boardContainer'),
        ghostCanvas: document.getElementById('ghostCanvas'),
        gridOverlay: document.getElementById('gridOverlay'),
        snappedCanvas: document.getElementById('snappedCanvas'),
        boardPiecesLayer: document.getElementById('boardPiecesLayer'),
        trayContainer: document.getElementById('trayContainer'),
        trayPiecesArea: document.getElementById('trayPiecesArea'),
        timerDisplay: document.getElementById('timerDisplay'),
        movesDisplay: document.getElementById('movesDisplay'),
        progressText: document.getElementById('progressText'),
        progressBarFill: document.getElementById('progressBarFill'),
        trayCountBadge: document.getElementById('trayCountBadge'),
        difficultyButtons: document.querySelectorAll('#difficultyGroup .seg-btn'),
        imagePills: document.querySelectorAll('#imageGallerySelector .image-pill:not(.upload-pill)'),
        customImageInput: document.getElementById('customImageInput'),
        toggleGhostBtn: document.getElementById('toggleGhostBtn'),
        toggleRotationBtn: document.getElementById('toggleRotationBtn'),
        previewBtn: document.getElementById('previewBtn'),
        filterEdgesBtn: document.getElementById('filterEdgesBtn'),
        hintBtn: document.getElementById('hintBtn'),
        shuffleBtn: document.getElementById('shuffleBtn'),
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        soundOnIcon: document.getElementById('soundOnIcon'),
        soundOffIcon: document.getElementById('soundOffIcon'),
        miniPreviewWidget: document.getElementById('miniPreviewWidget'),
        miniPreviewImg: document.getElementById('miniPreviewImg'),
        previewModal: document.getElementById('previewModal'),
        modalPreviewImg: document.getElementById('modalPreviewImg'),
        closePreviewModalBtn: document.getElementById('closePreviewModalBtn'),
        victoryModal: document.getElementById('victoryModal'),
        confettiCanvas: document.getElementById('confettiCanvas'),
        victoryStars: document.getElementById('victoryStars'),
        finalTimeDisplay: document.getElementById('finalTimeDisplay'),
        finalMovesDisplay: document.getElementById('finalMovesDisplay'),
        finalPiecesDisplay: document.getElementById('finalPiecesDisplay'),
        victoryReplayBtn: document.getElementById('victoryReplayBtn'),
        victoryNextLevelBtn: document.getElementById('victoryNextLevelBtn'),
        tabAllPieces: document.getElementById('tabAllPieces'),
        tabEdgePieces: document.getElementById('tabEdgePieces'),
        tabInnerPieces: document.getElementById('tabInnerPieces'),
        dragLayer: document.getElementById('dragLayer'),
        saveGameBtn: document.getElementById('saveGameBtn'),
        loadGameBtn: document.getElementById('loadGameBtn'),
        toastContainer: document.getElementById('toastContainer')
      };

      // Sound & Confetti
      this.sound = new SoundFX();
      this.confetti = new ConfettiEngine(this.dom.confettiCanvas);

      // Drag Tracking
      this.draggedPiece = null;
      this.dragOffset = { x: 0, y: 0 };
      this.topZIndex = 100;

      this.initEvents();
      this.loadImage(this.currentImageSrc);
      this.updateSaveLoadButtonState();
    }

    initEvents() {
      // Difficulty Selector
      this.dom.difficultyButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          this.dom.difficultyButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.gridSize = parseInt(btn.getAttribute('data-grid'), 10);
          this.restartGame();
        });
      });

      // Built-in Gallery Images
      this.dom.imagePills.forEach((pill) => {
        pill.addEventListener('click', () => {
          this.dom.imagePills.forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');
          const src = pill.getAttribute('data-src');
          this.currentImageSrc = src;
          this.loadImage(src);
        });
      });

      // Custom Image Upload
      this.dom.customImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.dom.imagePills.forEach((p) => p.classList.remove('active'));
            this.currentImageSrc = event.target.result;
            this.loadImage(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      });

      // Toggle Ghost / Blueprint Image
      this.dom.toggleGhostBtn.addEventListener('click', () => {
        this.ghostEnabled = !this.ghostEnabled;
        this.dom.toggleGhostBtn.classList.toggle('active', this.ghostEnabled);
        this.dom.ghostCanvas.classList.toggle('hidden', !this.ghostEnabled);
      });
      this.dom.toggleGhostBtn.classList.add('active');

      // Toggle Rotation Mode
      if (this.dom.toggleRotationBtn) {
        this.dom.toggleRotationBtn.addEventListener('click', () => {
          this.rotationEnabled = !this.rotationEnabled;
          this.dom.toggleRotationBtn.classList.toggle('active', this.rotationEnabled);
          this.restartGame();
        });
      }

      // Preview Modals
      const openPreview = () => {
        this.dom.modalPreviewImg.src = this.currentImageSrc;
        this.dom.previewModal.style.display = 'flex';
      };
      this.dom.previewBtn.addEventListener('click', openPreview);
      this.dom.miniPreviewWidget.addEventListener('click', openPreview);
      this.dom.closePreviewModalBtn.addEventListener('click', () => {
        this.dom.previewModal.style.display = 'none';
      });
      this.dom.previewModal.addEventListener('click', (e) => {
        if (e.target === this.dom.previewModal) {
          this.dom.previewModal.style.display = 'none';
        }
      });

      // Filter Edge Pieces Button & Tabs
      this.dom.filterEdgesBtn.addEventListener('click', () => {
        if (this.activeTrayFilter === 'edge') {
          this.setTrayFilter('all');
        } else {
          this.setTrayFilter('edge');
        }
      });

      this.dom.tabAllPieces.addEventListener('click', () => this.setTrayFilter('all'));
      this.dom.tabEdgePieces.addEventListener('click', () => this.setTrayFilter('edge'));
      this.dom.tabInnerPieces.addEventListener('click', () => this.setTrayFilter('inner'));

      // Hint Button
      this.dom.hintBtn.addEventListener('click', () => this.giveHint());

      // Shuffle Button
      this.dom.shuffleBtn.addEventListener('click', () => this.scatterTrayPieces());

      // Sound Toggle
      this.dom.soundToggleBtn.addEventListener('click', () => {
        this.sound.enabled = !this.sound.enabled;
        this.dom.soundOnIcon.style.display = this.sound.enabled ? 'block' : 'none';
        this.dom.soundOffIcon.style.display = this.sound.enabled ? 'none' : 'block';
      });

      // Victory Modal Buttons
      this.dom.victoryReplayBtn.addEventListener('click', () => {
        this.dom.victoryModal.style.display = 'none';
        this.confetti.stop();
        this.restartGame();
      });

      this.dom.victoryNextLevelBtn.addEventListener('click', () => {
        this.dom.victoryModal.style.display = 'none';
        this.confetti.stop();
        if (this.gridSize < 6) {
          this.gridSize++;
          this.dom.difficultyButtons.forEach((b) => {
            b.classList.toggle('active', parseInt(b.getAttribute('data-grid'), 10) === this.gridSize);
          });
        }
        this.restartGame();
      });

      // Save/Load Buttons
      this.dom.saveGameBtn.addEventListener('click', () => this.saveGame());
      this.dom.loadGameBtn.addEventListener('click', () => this.loadGame());

      // Responsive Board Resize Handler
      window.addEventListener('resize', () => {
        this.updateBoardDimensions();
        this.renderGhostAndGrid();
        this.renderSnappedPieces();
      });
    }

    // --- Toast Notification System ---
    showToast(message, type = 'info', durationMs = 3000) {
      const iconMap = {
        success: '✅',
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌'
      };
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `<span class="toast-icon">${iconMap[type] || iconMap.info}</span><span>${message}</span>`;
      this.dom.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 350);
      }, durationMs);
    }

    // --- Save/Load Button State ---
    updateSaveLoadButtonState() {
      const hasSave = !!localStorage.getItem('jigsaw_save');
      this.dom.saveGameBtn.classList.toggle('has-save', hasSave);
      this.dom.loadGameBtn.classList.toggle('has-save', hasSave);
    }

    setTrayFilter(filter) {
      this.activeTrayFilter = filter;
      this.dom.tabAllPieces.classList.toggle('active', filter === 'all');
      this.dom.tabEdgePieces.classList.toggle('active', filter === 'edge');
      this.dom.tabInnerPieces.classList.toggle('active', filter === 'inner');
      this.dom.filterEdgesBtn.classList.toggle('active', filter === 'edge');

      // Update visibility of loose pieces in tray
      this.pieces.forEach((p) => {
        if (!p.isSnapped) {
          let visible = true;
          if (filter === 'edge') visible = p.isEdge;
          if (filter === 'inner') visible = !p.isEdge;
          p.element.classList.toggle('filtered-out', !visible);
        }
      });
    }

    loadImage(src) {
      const img = new Image();
      img.onload = () => {
        this.sourceImage = img;
        this.dom.miniPreviewImg.src = src;
        this.dom.modalPreviewImg.src = src;
        this.restartGame();
      };
      img.onerror = () => {
        console.error('Lỗi khi tải ảnh:', src);
      };
      img.src = src;
    }

    restartGame() {
      // Reset timer & moves
      this.stopTimer();
      this.secondsElapsed = 0;
      this.movesCount = 0;
      this.snappedCount = 0;
      this.updateStats();

      // Clear pieces
      this.dom.trayPiecesArea.innerHTML = '';
      this.dom.boardPiecesLayer.innerHTML = '';
      this.pieces = [];

      this.updateBoardDimensions();
      this.renderGhostAndGrid();

      // Clear snapped canvas
      const snappedCtx = this.dom.snappedCanvas.getContext('2d');
      snappedCtx.clearRect(0, 0, this.dom.snappedCanvas.width, this.dom.snappedCanvas.height);

      // Generate puzzle pieces
      this.generatePieces();
      this.scatterTrayPieces();
      this.startTimer();
      this.isGameActive = true;
    }

    updateBoardDimensions() {
      // Calculate responsive board size that fits container cleanly
      const containerWidth = this.dom.boardContainer.clientWidth - 40;
      const containerHeight = this.dom.boardContainer.clientHeight - 40;

      // Desired aspect ratio from source image or default 4:3
      const imgAspect = this.sourceImage ? this.sourceImage.width / this.sourceImage.height : 4 / 3;

      let bW = containerWidth;
      let bH = bW / imgAspect;

      if (bH > containerHeight) {
        bH = containerHeight;
        bW = bH * imgAspect;
      }

      // Constraints
      bW = Math.max(300, Math.min(bW, 800));
      bH = bW / imgAspect;

      this.boardWidth = Math.round(bW);
      this.boardHeight = Math.round(bH);

      this.pieceWidth = this.boardWidth / this.gridSize;
      this.pieceHeight = this.boardHeight / this.gridSize;

      // Tab size (protrusion) is ~22% of piece dimension
      this.tabSize = Math.round(Math.min(this.pieceWidth, this.pieceHeight) * 0.22);
      this.padding = Math.round(this.tabSize * 1.5);

      // Apply size to canvases
      [this.dom.ghostCanvas, this.dom.snappedCanvas].forEach((canvas) => {
        canvas.width = this.boardWidth;
        canvas.height = this.boardHeight;
        canvas.style.width = `${this.boardWidth}px`;
        canvas.style.height = `${this.boardHeight}px`;
      });

      this.dom.gridOverlay.style.width = `${this.boardWidth}px`;
      this.dom.gridOverlay.style.height = `${this.boardHeight}px`;
    }

    renderGhostAndGrid() {
      if (!this.sourceImage) return;

      // Draw ghost blueprint
      const gCtx = this.dom.ghostCanvas.getContext('2d');
      gCtx.clearRect(0, 0, this.boardWidth, this.boardHeight);
      gCtx.drawImage(this.sourceImage, 0, 0, this.boardWidth, this.boardHeight);

      // Draw grid overlay lines
      this.dom.gridOverlay.innerHTML = '';
      this.dom.gridOverlay.style.display = 'grid';
      this.dom.gridOverlay.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
      this.dom.gridOverlay.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

      for (let i = 0; i < this.gridSize * this.gridSize; i++) {
        const cell = document.createElement('div');
        cell.style.border = '1px dashed rgba(255, 255, 255, 0.08)';
        this.dom.gridOverlay.appendChild(cell);
      }
    }

    // --- Bézier Interlocking Cuts Generator ---
    generatePieces() {
      const R = this.gridSize;
      const C = this.gridSize;
      this.totalPieces = R * C;

      // Generate random interlocking edges
      // hEdges: horizontal edges between (r, c) and (r+1, c)
      // +1 means tab points down, -1 means tab points up
      const hEdges = [];
      for (let r = 0; r <= R; r++) {
        hEdges[r] = [];
        for (let c = 0; c < C; c++) {
          if (r === 0 || r === R) {
            hEdges[r][c] = 0; // Flat outer borders
          } else {
            hEdges[r][c] = Math.random() > 0.5 ? 1 : -1;
          }
        }
      }

      // vEdges: vertical edges between (r, c) and (r, c+1)
      // +1 means tab points right, -1 means tab points left
      const vEdges = [];
      for (let r = 0; r < R; r++) {
        vEdges[r] = [];
        for (let c = 0; c <= C; c++) {
          if (c === 0 || c === C) {
            vEdges[r][c] = 0; // Flat outer borders
          } else {
            vEdges[r][c] = Math.random() > 0.5 ? 1 : -1;
          }
        }
      }

      this.pieces = [];

      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          // Edges for piece (r, c)
          // Top: -hEdges[r][c]
          // Right: vEdges[r][c+1]
          // Bottom: hEdges[r+1][c]
          // Left: -vEdges[r][c]
          const edges = {
            top: -hEdges[r][c],
            right: vEdges[r][c + 1],
            bottom: hEdges[r + 1][c],
            left: -vEdges[r][c]
          };

          const isEdge = r === 0 || r === R - 1 || c === 0 || c === C - 1;

          // Góc xoay ban đầu ngẫu nhiên: 90, 180, 270 hoặc 0 độ
          const angles = [90, 180, 270, 0];
          const initialRotation = this.rotationEnabled
            ? angles[Math.floor(Math.random() * angles.length)]
            : 0;

          const piece = {
            id: `p_${r}_${c}`,
            row: r,
            col: c,
            isEdge: isEdge,
            edges: edges,
            isSnapped: false,
            rotation: initialRotation,
            // Target coordinate on board
            targetX: c * this.pieceWidth,
            targetY: r * this.pieceHeight,
            // Current position
            x: 0,
            y: 0,
            element: null,
            canvas: null
          };

          this.renderPieceElement(piece);
          this.pieces.push(piece);
        }
      }

      this.updateStats();
    }

    // --- Draw Bézier Curve Jigsaw Piece on Offscreen Canvas ---
    renderPieceElement(piece) {
      const pw = this.pieceWidth;
      const ph = this.pieceHeight;
      const pad = this.padding;
      const tab = this.tabSize;

      const fullW = Math.round(pw + pad * 2);
      const fullH = Math.round(ph + pad * 2);

      const canvas = document.createElement('canvas');
      canvas.width = fullW;
      canvas.height = fullH;
      canvas.style.width = `${fullW}px`;
      canvas.style.height = `${fullH}px`;

      const ctx = canvas.getContext('2d');

      // Create Jigsaw Path
      ctx.save();
      ctx.translate(pad, pad);

      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Top Edge (from 0,0 to pw, 0)
      this.drawJigsawEdge(ctx, 0, 0, pw, 0, piece.edges.top, tab);

      // Right Edge (from pw,0 to pw, ph)
      this.drawJigsawEdge(ctx, pw, 0, pw, ph, piece.edges.right, tab);

      // Bottom Edge (from pw, ph to 0, ph)
      this.drawJigsawEdge(ctx, pw, ph, 0, ph, piece.edges.bottom, tab);

      // Left Edge (from 0, ph to 0, 0)
      this.drawJigsawEdge(ctx, 0, ph, 0, 0, piece.edges.left, tab);

      ctx.closePath();

      // Clip to jigsaw path
      ctx.clip();

      // Draw piece slice from source image
      const srcSliceW = this.sourceImage.width / this.gridSize;
      const srcSliceH = this.sourceImage.height / this.gridSize;
      const srcX = piece.col * srcSliceW;
      const srcY = piece.row * srcSliceH;

      // Draw image with slight padding overlap so tabs have full image content
      const padRatioW = (pad / pw) * srcSliceW;
      const padRatioH = (pad / ph) * srcSliceH;

      ctx.drawImage(
        this.sourceImage,
        srcX - padRatioW,
        srcY - padRatioH,
        srcSliceW + padRatioW * 2,
        srcSliceH + padRatioH * 2,
        -pad,
        -pad,
        fullW,
        fullH
      );

      // 3D Bevel & Lighting Stroke
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.stroke();

      // Inner shadow / ambient occlusion
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.stroke();

      ctx.restore();

      // Wrapper DOM element for dragging
      const el = document.createElement('div');
      el.className = 'jigsaw-piece';
      el.id = piece.id;
      el.style.width = `${fullW}px`;
      el.style.height = `${fullH}px`;
      
      // Áp dụng góc xoay ban đầu cho canvas
      canvas.style.transform = `rotate(${piece.rotation}deg)`;
      canvas.style.transformOrigin = 'center center';
      el.appendChild(canvas);

      // Store references
      piece.canvas = canvas;
      piece.element = el;

      this.bindPieceDragEvents(piece);
    }

    // Draw single jigsaw edge with Bézier curve tab / blank
    drawJigsawEdge(ctx, x1, y1, x2, y2, edgeType, tabSize) {
      if (edgeType === 0) {
        // Flat boundary
        ctx.lineTo(x2, y2);
        return;
      }

      // Vector from (x1, y1) to (x2, y2)
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);

      // Normal unit vector (perpendicular pointing outward)
      // For top (dx > 0, dy = 0), normal is (0, -1) if tab points outward
      const nx = -dy / len;
      const ny = dx / len;

      // Flip normal based on edgeType (+1 outward tab, -1 inward blank)
      const sign = edgeType;
      const tab = tabSize * sign;

      // Proportional anchor points along the line (0.0 to 1.0)
      const p = (t, offsetNormal = 0) => ({
        x: x1 + dx * t + nx * offsetNormal,
        y: y1 + dy * t + ny * offsetNormal
      });

      // Realistic jigsaw curve points
      const p1 = p(0.36, 0);
      const cp1 = p(0.38, tab * 0.15);
      const cp2 = p(0.32, tab * 0.8);
      const p2 = p(0.42, tab * 1.15);

      const cp3 = p(0.5, tab * 1.35);
      const p3 = p(0.58, tab * 1.15);

      const cp4 = p(0.68, tab * 0.8);
      const cp5 = p(0.62, tab * 0.15);
      const p4 = p(0.64, 0);

      // Draw Bézier segments
      ctx.lineTo(p1.x, p1.y);
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
      ctx.bezierCurveTo(cp3.x, cp3.y, cp3.x, cp3.y, p3.x, p3.y);
      ctx.bezierCurveTo(cp4.x, cp4.y, cp5.x, cp5.y, p4.x, p4.y);
      ctx.lineTo(x2, y2);
    }

    // --- Drag & Drop Mechanics with Global Drag Layer & 90deg Rotation ---
    bindPieceDragEvents(piece) {
      const el = piece.element;
      let startX = 0;
      let startY = 0;
      let hasDragged = false;

      el.addEventListener('pointerdown', (e) => {
        if (piece.isSnapped) return;
        if (e.button !== undefined && e.button !== 0) return; // Only primary mouse button
        e.preventDefault();

        this.draggedPiece = piece;
        this.topZIndex++;
        startX = e.clientX;
        startY = e.clientY;
        hasDragged = false;

        // Store bounding rect and click offset inside the piece
        const rect = el.getBoundingClientRect();
        this.dragOffset = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };

        // Record initial state so if drag is cancelled or dropped outside, it restores seamlessly
        piece.origParent = el.parentElement;
        piece.origLeft = el.style.left;
        piece.origTop = el.style.top;

        try {
          el.setPointerCapture(e.pointerId);
        } catch (_) {}
      });

      el.addEventListener('pointermove', (e) => {
        if (this.draggedPiece !== piece) return;
        e.preventDefault();

        // Ngưỡng phát hiện kéo thả (di chuyển > 6px mới kích hoạt kéo)
        if (!hasDragged) {
          const moveDist = Math.hypot(e.clientX - startX, e.clientY - startY);
          if (moveDist > 6) {
            hasDragged = true;
            this.sound.playPickup();

            // Đưa lên lớp drag layer toàn cục để bay mượt mà không bị che khuất
            this.dom.dragLayer.appendChild(el);
            el.style.position = 'fixed';
            el.style.zIndex = '999999';
            el.classList.add('dragging');
          }
        }

        if (hasDragged) {
          this.updatePiecePosition(piece, e.clientX, e.clientY);
        }
      });

      const onEnd = (e) => {
        if (this.draggedPiece !== piece) return;
        e.preventDefault();
        this.draggedPiece = null;

        try {
          el.releasePointerCapture(e.pointerId);
        } catch (_) {}

        if (!hasDragged) {
          // NGƯỜI CHƠI CLICK CHUỘT: XOAY 90 ĐỘ THEO CHIỀU KIM ĐỒNG HỒ!
          this.rotatePiece(piece);
        } else {
          // NGƯỜI CHƠI KÉO THẢ: XỬ LÝ ĐẶT VÀO BÀN CỜ / KHAY
          el.classList.remove('dragging');
          this.movesCount++;
          this.updateStats();
          this.finalizePieceDrop(piece, e.clientX, e.clientY);
        }
      };

      el.addEventListener('pointerup', onEnd);
      el.addEventListener('pointercancel', onEnd);
    }

    // Xoay mảnh ghép 90 độ theo chiều kim đồng hồ
    rotatePiece(piece) {
      if (piece.isSnapped) return;
      piece.rotation = (piece.rotation + 90) % 360;
      piece.canvas.style.transform = `rotate(${piece.rotation}deg)`;
      this.sound.playRotate();

      // Nếu mảnh đang nằm trên bàn cờ và vừa được xoay về đúng 0 độ gần ô đích, tự động snap!
      if (piece.rotation === 0 && piece.element.parentElement === this.dom.boardPiecesLayer) {
        const ghostRect = this.dom.ghostCanvas.getBoundingClientRect();
        const targetScreenX = ghostRect.left + piece.targetX - this.padding;
        const targetScreenY = ghostRect.top + piece.targetY - this.padding;

        const elRect = piece.element.getBoundingClientRect();
        const dist = Math.hypot(elRect.left - targetScreenX, elRect.top - targetScreenY);
        if (dist <= 42) {
          this.snapPiece(piece);
        }
      }
    }

    updatePiecePosition(piece, clientX, clientY) {
      const left = clientX - this.dragOffset.x;
      const top = clientY - this.dragOffset.y;
      piece.element.style.left = `${left}px`;
      piece.element.style.top = `${top}px`;
    }

    finalizePieceDrop(piece, clientX, clientY) {
      const el = piece.element;
      const currentScreenX = clientX - this.dragOffset.x;
      const currentScreenY = clientY - this.dragOffset.y;

      // 1. Kiểm tra Bắt dính nam châm (Magnetic Snap) vào vị trí trên bàn cờ
      const ghostRect = this.dom.ghostCanvas.getBoundingClientRect();
      const targetScreenX = ghostRect.left + piece.targetX - this.padding;
      const targetScreenY = ghostRect.top + piece.targetY - this.padding;

      const dist = Math.hypot(currentScreenX - targetScreenX, currentScreenY - targetScreenY);
      const snapThreshold = 42; // Bán kính hút nam châm 42px

      if (dist <= snapThreshold) {
        // YÊU CẦU: Phải xoay về đúng góc 0 độ mới được snap!
        if (piece.rotation % 360 === 0) {
          // Đúng vị trí và đúng góc xoay 0° -> SNAP THÀNH CÔNG!
          this.snapPiece(piece);
          return;
        } else {
          // Đúng vị trí nhưng SAI GÓC XOAY -> Rung lắc và phát âm thanh nhắc nhở
          this.sound.playWiggle();
          el.classList.add('wiggle');
          setTimeout(() => el.classList.remove('wiggle'), 450);

          // Đặt mảnh tạm thời ngay tại vị trí đó trên bàn cờ để người chơi click xoay
          this.dom.boardPiecesLayer.appendChild(el);
          el.style.position = 'absolute';
          const layerRect = this.dom.boardPiecesLayer.getBoundingClientRect();
          el.style.left = `${currentScreenX - layerRect.left}px`;
          el.style.top = `${currentScreenY - layerRect.top}px`;
          return;
        }
      }

      // 2. Kiểm tra nếu thả trong phạm vi khung bàn cờ
      const boardRect = this.dom.boardContainer.getBoundingClientRect();
      const pieceW = this.pieceWidth + this.padding * 2;
      const pieceH = this.pieceHeight + this.padding * 2;
      const pieceCenterX = currentScreenX + pieceW * 0.5;
      const pieceCenterY = currentScreenY + pieceH * 0.5;

      const isOverBoard =
        pieceCenterX >= boardRect.left &&
        pieceCenterX <= boardRect.right &&
        pieceCenterY >= boardRect.top &&
        pieceCenterY <= boardRect.bottom;

      if (isOverBoard) {
        this.dom.boardPiecesLayer.appendChild(el);
        el.style.position = 'absolute';
        const layerRect = this.dom.boardPiecesLayer.getBoundingClientRect();
        el.style.left = `${currentScreenX - layerRect.left}px`;
        el.style.top = `${currentScreenY - layerRect.top}px`;
        return;
      }

      // 3. Kiểm tra nếu thả trong khay mảnh rời
      const trayRect = this.dom.trayContainer.getBoundingClientRect();
      const isOverTray =
        pieceCenterX >= trayRect.left &&
        pieceCenterX <= trayRect.right &&
        pieceCenterY >= trayRect.top &&
        pieceCenterY <= trayRect.bottom;

      if (isOverTray) {
        this.dom.trayPiecesArea.appendChild(el);
        el.style.position = 'absolute';
        const areaRect = this.dom.trayPiecesArea.getBoundingClientRect();
        const leftInTray = Math.max(4, currentScreenX - areaRect.left);
        const topInTray = Math.max(4, currentScreenY - areaRect.top);
        el.style.left = `${leftInTray}px`;
        el.style.top = `${topInTray}px`;
        return;
      }

      // 4. Thả ra ngoài các vùng hợp lệ: đưa về lại vị trí trước khi kéo
      if (piece.origParent) {
        piece.origParent.appendChild(el);
        el.style.position = 'absolute';
        el.style.left = piece.origLeft || '10px';
        el.style.top = piece.origTop || '10px';
      } else {
        this.returnPieceToTray(piece);
      }
    }

    snapPiece(piece) {
      piece.isSnapped = true;
      this.snappedCount++;
      this.sound.playSnap();

      // Remove from drag/piece layer and stamp permanently onto snappedCanvas
      if (piece.element.parentNode) {
        piece.element.parentNode.removeChild(piece.element);
      }

      const sCtx = this.dom.snappedCanvas.getContext('2d');
      sCtx.drawImage(
        piece.canvas,
        piece.targetX - this.padding,
        piece.targetY - this.padding
      );

      this.updateStats();

      // Check win condition
      if (this.snappedCount === this.totalPieces) {
        this.handleVictory();
      }
    }

    returnPieceToTray(piece) {
      this.dom.trayPiecesArea.appendChild(piece.element);
      piece.element.style.position = 'absolute';
      const trayRect = this.dom.trayPiecesArea.getBoundingClientRect();

      const maxX = Math.max(10, trayRect.width - (this.pieceWidth + this.padding * 2) - 10);
      const maxY = Math.max(10, this.dom.trayContainer.clientHeight - (this.pieceHeight + this.padding * 2) - 10);

      const randX = Math.floor(Math.random() * maxX);
      const randY = Math.floor(Math.random() * maxY);

      piece.element.style.left = `${randX}px`;
      piece.element.style.top = `${randY}px`;
    }

    scatterTrayPieces() {
      // Randomly disperse all loose pieces inside the tray container
      const area = this.dom.trayPiecesArea;
      const areaWidth = Math.max(area.clientWidth || 320, 320);

      let col = 0;
      let row = 0;
      const colWidth = Math.round(this.pieceWidth + this.padding * 1.5);
      const rowHeight = Math.round(this.pieceHeight + this.padding * 1.2);
      const cols = Math.max(2, Math.floor(areaWidth / colWidth));

      const loosePieces = this.pieces.filter((p) => !p.isSnapped);
      // Shuffle array
      loosePieces.sort(() => Math.random() - 0.5);

      loosePieces.forEach((piece) => {
        area.appendChild(piece.element);
        piece.element.style.position = 'absolute';

        // Position with natural jitter
        const jitterX = (Math.random() - 0.5) * 16;
        const jitterY = (Math.random() - 0.5) * 16;

        const posX = Math.max(8, col * (colWidth * 0.85) + jitterX);
        const posY = Math.max(8, row * (rowHeight * 0.85) + jitterY);

        piece.element.style.left = `${Math.round(posX)}px`;
        piece.element.style.top = `${Math.round(posY)}px`;

        col++;
        if (col >= cols) {
          col = 0;
          row++;
        }
      });

      // Update minimum height of tray area to ensure smooth scrolling
      area.style.minHeight = `${(row + 2) * rowHeight}px`;
    }

    giveHint() {
      const unplaced = this.pieces.filter((p) => !p.isSnapped);
      if (unplaced.length === 0) return;

      // Pick a random unplaced piece (prefer edge pieces first)
      const edgeUnplaced = unplaced.filter((p) => p.isEdge);
      const piece = edgeUnplaced.length > 0
        ? edgeUnplaced[Math.floor(Math.random() * edgeUnplaced.length)]
        : unplaced[Math.floor(Math.random() * unplaced.length)];

      this.sound.playHint();

      // Tự động xoay về góc 0 độ chuẩn nếu đang bị xoay
      if (piece.rotation !== 0) {
        piece.rotation = 0;
        piece.canvas.style.transform = 'rotate(0deg)';
      }

      // Highlight and animate snap
      piece.element.classList.add('hint-highlight');
      setTimeout(() => {
        piece.element.classList.remove('hint-highlight');
        this.snapPiece(piece);
      }, 500);
    }

    // --- Game Timer & Statistics ---
    startTimer() {
      this.stopTimer();
      this.timerInterval = setInterval(() => {
        this.secondsElapsed++;
        this.updateStats();
      }, 1000);
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }

    updateStats() {
      this.dom.timerDisplay.textContent = this.formatTime(this.secondsElapsed);
      this.dom.movesDisplay.textContent = this.movesCount;

      const pct = this.totalPieces > 0 ? Math.round((this.snappedCount / this.totalPieces) * 100) : 0;
      this.dom.progressText.textContent = `${this.snappedCount} / ${this.totalPieces} (${pct}%)`;
      this.dom.progressBarFill.style.width = `${pct}%`;

      const remainingInTray = this.totalPieces - this.snappedCount;
      this.dom.trayCountBadge.textContent = `${remainingInTray} mảnh`;
    }

    // --- Victory Handling ---
    handleVictory() {
      this.isGameActive = false;
      this.stopTimer();
      this.sound.playVictory();
      this.confetti.start();

      // Calculate star rating
      // 3 stars: under 2 min and low extra moves
      // 2 stars: under 4 min
      // 1 star: completed
      let stars = 3;
      const thresholdTime = this.gridSize * this.gridSize * 7; // ~112s for 16 pcs
      const thresholdMoves = this.gridSize * this.gridSize * 1.8;

      if (this.secondsElapsed > thresholdTime * 1.8 || this.movesCount > thresholdMoves * 1.8) {
        stars = 1;
      } else if (this.secondsElapsed > thresholdTime || this.movesCount > thresholdMoves) {
        stars = 2;
      }

      // Render stars
      const starSpans = this.dom.victoryStars.querySelectorAll('.star');
      starSpans.forEach((s, idx) => {
        s.classList.toggle('active', idx < stars);
      });

      this.dom.finalTimeDisplay.textContent = this.formatTime(this.secondsElapsed);
      this.dom.finalMovesDisplay.textContent = this.movesCount;
      this.dom.finalPiecesDisplay.textContent = `${this.totalPieces} / ${this.totalPieces}`;

      setTimeout(() => {
        this.dom.victoryModal.style.display = 'flex';
      }, 400);
    }

    // --- Save Game State ---
    saveGame() {
      if (!this.isGameActive && this.snappedCount !== this.totalPieces) {
        this.showToast('Không có game nào đang chơi để lưu!', 'warning');
        return;
      }
      if (this.snappedCount === this.totalPieces) {
        this.showToast('Game đã hoàn thành, không cần lưu!', 'info');
        return;
      }

      try {
        const piecesState = this.pieces.map((p) => {
          let location = 'tray';
          let posLeft = '0px';
          let posTop = '0px';
          if (p.isSnapped) {
            location = 'snapped';
          } else if (p.element.parentElement === this.dom.boardPiecesLayer) {
            location = 'board';
            posLeft = p.element.style.left;
            posTop = p.element.style.top;
          } else {
            location = 'tray';
            posLeft = p.element.style.left;
            posTop = p.element.style.top;
          }

          return {
            id: p.id,
            row: p.row,
            col: p.col,
            isEdge: p.isEdge,
            edges: p.edges,
            isSnapped: p.isSnapped,
            rotation: p.rotation,
            location: location,
            posLeft: posLeft,
            posTop: posTop
          };
        });

        const saveData = {
          version: 1,
          timestamp: Date.now(),
          gridSize: this.gridSize,
          currentImageSrc: this.currentImageSrc,
          secondsElapsed: this.secondsElapsed,
          movesCount: this.movesCount,
          snappedCount: this.snappedCount,
          totalPieces: this.totalPieces,
          rotationEnabled: this.rotationEnabled,
          ghostEnabled: this.ghostEnabled,
          pieces: piecesState
        };

        localStorage.setItem('jigsaw_save', JSON.stringify(saveData));
        this.updateSaveLoadButtonState();
        this.showToast(`Game đã lưu! (${this.snappedCount}/${this.totalPieces} mảnh, ${this.formatTime(this.secondsElapsed)})`, 'success');
      } catch (e) {
        console.error('Save game error:', e);
        this.showToast('Lỗi khi lưu game!', 'error');
      }
    }

    // --- Load Game State ---
    loadGame() {
      const raw = localStorage.getItem('jigsaw_save');
      if (!raw) {
        this.showToast('Chưa có game nào được lưu!', 'warning');
        return;
      }

      let saveData;
      try {
        saveData = JSON.parse(raw);
      } catch (e) {
        this.showToast('Dữ liệu lưu bị hỏng!', 'error');
        return;
      }

      if (!saveData.version || !saveData.pieces || !saveData.gridSize) {
        this.showToast('Dữ liệu lưu không hợp lệ!', 'error');
        return;
      }

      // Restore config
      this.gridSize = saveData.gridSize;
      this.rotationEnabled = saveData.rotationEnabled;
      this.ghostEnabled = saveData.ghostEnabled;

      // Update UI controls to match
      this.dom.difficultyButtons.forEach((b) => {
        b.classList.toggle('active', parseInt(b.getAttribute('data-grid'), 10) === this.gridSize);
      });
      this.dom.toggleGhostBtn.classList.toggle('active', this.ghostEnabled);
      this.dom.ghostCanvas.classList.toggle('hidden', !this.ghostEnabled);
      if (this.dom.toggleRotationBtn) {
        this.dom.toggleRotationBtn.classList.toggle('active', this.rotationEnabled);
      }

      // Update image pill selection
      this.currentImageSrc = saveData.currentImageSrc;
      let foundPill = false;
      this.dom.imagePills.forEach((pill) => {
        const match = pill.getAttribute('data-src') === this.currentImageSrc;
        pill.classList.toggle('active', match);
        if (match) foundPill = true;
      });
      if (!foundPill) {
        this.dom.imagePills.forEach((p) => p.classList.remove('active'));
      }

      // Load the image, then restore pieces
      const img = new Image();
      img.onload = () => {
        this.sourceImage = img;
        this.dom.miniPreviewImg.src = this.currentImageSrc;
        this.dom.modalPreviewImg.src = this.currentImageSrc;
        this.restoreGameFromSave(saveData);
      };
      img.onerror = () => {
        this.showToast('Không thể tải ảnh đã lưu!', 'error');
      };
      img.src = this.currentImageSrc;
    }

    restoreGameFromSave(saveData) {
      this.stopTimer();

      this.secondsElapsed = saveData.secondsElapsed;
      this.movesCount = saveData.movesCount;
      this.snappedCount = 0;
      this.totalPieces = saveData.totalPieces;

      this.dom.trayPiecesArea.innerHTML = '';
      this.dom.boardPiecesLayer.innerHTML = '';
      this.pieces = [];

      this.updateBoardDimensions();
      this.renderGhostAndGrid();

      const snappedCtx = this.dom.snappedCanvas.getContext('2d');
      snappedCtx.clearRect(0, 0, this.dom.snappedCanvas.width, this.dom.snappedCanvas.height);

      for (const ps of saveData.pieces) {
        const piece = {
          id: ps.id,
          row: ps.row,
          col: ps.col,
          isEdge: ps.isEdge,
          edges: ps.edges,
          isSnapped: false,
          rotation: ps.rotation,
          targetX: ps.col * this.pieceWidth,
          targetY: ps.row * this.pieceHeight,
          x: 0,
          y: 0,
          element: null,
          canvas: null
        };

        this.renderPieceElement(piece);
        this.pieces.push(piece);

        if (ps.isSnapped) {
          piece.rotation = 0;
          piece.canvas.style.transform = 'rotate(0deg)';
          this.snappedCount++;
          piece.isSnapped = true;
          if (piece.element.parentNode) {
            piece.element.parentNode.removeChild(piece.element);
          }
          snappedCtx.drawImage(
            piece.canvas,
            piece.targetX - this.padding,
            piece.targetY - this.padding
          );
        } else if (ps.location === 'board') {
          this.dom.boardPiecesLayer.appendChild(piece.element);
          piece.element.style.position = 'absolute';
          piece.element.style.left = ps.posLeft;
          piece.element.style.top = ps.posTop;
        } else {
          this.dom.trayPiecesArea.appendChild(piece.element);
          piece.element.style.position = 'absolute';
          piece.element.style.left = ps.posLeft;
          piece.element.style.top = ps.posTop;
        }
      }

      this.updateStats();
      this.startTimer();
      this.isGameActive = true;

      const savedDate = new Date(saveData.timestamp);
      const timeStr = savedDate.toLocaleString('vi-VN');
      this.showToast(`Đã tải game! (${this.snappedCount}/${this.totalPieces} mảnh — lưu lúc ${timeStr})`, 'success', 4000);
    }
  }

  // Initialize Game on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    window.jigsawGame = new JigsawGame();
  });

  // Auto-save on page unload (if game is active)
  window.addEventListener('beforeunload', () => {
    if (window.jigsawGame && window.jigsawGame.isGameActive && window.jigsawGame.snappedCount < window.jigsawGame.totalPieces) {
      window.jigsawGame.saveGame();
    }
  });
})();

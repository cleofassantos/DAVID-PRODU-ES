import React, { useEffect, useRef, useState } from 'react';
import { Character, Question, questions } from '../game/data';

interface GameCanvasProps {
  character: Character;
  onGameOver: (score: number, coins: number) => void;
  onQuestionTrigger: (question: Question) => void;
  isPaused: boolean;
  questionAnswered: 'correct' | 'incorrect' | null;
  onQuestionResolved: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MAX_SPEED = 15;
const GROUND_Y = 300; // Assuming canvas height 400

class SoundEngine {
  ctx: AudioContext | null = null;
  isPlayingBgm = false;
  bgmInterval: any = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1, slideFreq: number | null = null) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (slideFreq) {
        osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors
    }
  }

  jump() { this.playTone(150, 'sine', 0.2, 0.1, 300); }
  coin() { this.playTone(1200, 'sine', 0.1, 0.05, 2000); }
  hit() { this.playTone(100, 'sawtooth', 0.3, 0.1, 50); }
  break() { this.playTone(300, 'square', 0.2, 0.05, 100); }
  destroy() { this.playTone(200, 'sawtooth', 0.1, 0.05, 100); }
  correct() {
    this.playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(600, 'sine', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(800, 'sine', 0.2, 0.1), 200);
  }
  incorrect() {
    this.playTone(300, 'sawtooth', 0.2, 0.1, 250);
    setTimeout(() => this.playTone(250, 'sawtooth', 0.4, 0.1, 200), 200);
  }
  gameOver() {
    this.playTone(400, 'square', 0.2, 0.1, 300);
    setTimeout(() => this.playTone(300, 'square', 0.2, 0.1, 200), 200);
    setTimeout(() => this.playTone(200, 'square', 0.4, 0.1, 100), 400);
  }
  
  startBGM() {
    this.init();
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    
    const notes = [220, 220, 330, 220, 293, 220, 261, 196];
    let step = 0;
    
    this.bgmInterval = setInterval(() => {
      if (!this.isPlayingBgm || !this.ctx) return;
      const freq = notes[step % notes.length];
      this.playTone(freq, 'triangle', 0.15, 0.02);
      step++;
    }, 250);
  }
  
  stopBGM() {
    this.isPlayingBgm = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

const sound = new SoundEngine();

export default function GameCanvas({
  character,
  onGameOver,
  onQuestionTrigger,
  isPaused,
  questionAnswered,
  onQuestionResolved,
  difficulty
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  const baseSpeed = difficulty === 'easy' ? 3.5 : difficulty === 'hard' ? 7 : 5;
  
  // Game State Refs (to avoid dependency issues in loop)
  const state = useRef({
    player: {
      x: 50,
      y: GROUND_Y - 50,
      width: 40,
      height: 50,
      vy: 0,
      isJumping: false,
      canDoubleJump: character.power === 'doubleJump',
      isSliding: false,
      shieldActive: false,
      extraLifeActive: false,
      magnetActive: false, // Activated by powerup
      invincibleActive: false, // Activated by powerup
      multiplierActive: false,
    },
    obstacles: [] as any[],
    coins: [] as any[],
    tokens: [] as any[],
    particles: [] as any[],
    score: 0,
    coinsCollected: 0,
    speed: baseSpeed,
    distance: 0,
    frames: 0,
    powerTimer: 0, // Time left for active power
  });

  // BGM Management
  useEffect(() => {
    if (!isPaused) {
      sound.startBGM();
    } else {
      sound.stopBGM();
    }
    return () => sound.stopBGM();
  }, [isPaused]);

  // Handle question resolution
  useEffect(() => {
    if (questionAnswered) {
      if (questionAnswered === 'correct') {
        sound.correct();
        // Give a random powerup or speed boost
        state.current.powerTimer = 300; // 5 seconds at 60fps
        
        // Apply character specific power
        if (character.power === 'magnet') state.current.player.magnetActive = true;
        if (character.power === 'invincibility') state.current.player.invincibleActive = true;
        if (character.power === 'scoreMultiplier') state.current.player.multiplierActive = true;
        if (character.power === 'shield') state.current.player.shieldActive = true;
        if (character.power === 'extraLife') state.current.player.extraLifeActive = true;
        
        // Add some bonus score
        state.current.score += 500;
      } else {
        sound.incorrect();
        // Penalty or nothing
        state.current.score = Math.max(0, state.current.score - 100);
      }
      onQuestionResolved();
    }
  }, [questionAnswered, character.power, onQuestionResolved]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      sound.init();
      if (isPaused) return;
      const p = state.current.player;
      
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!p.isJumping) {
          sound.jump();
          p.vy = JUMP_FORCE;
          p.isJumping = true;
          p.isSliding = false;
        } else if (p.canDoubleJump) {
          sound.jump();
          p.vy = JUMP_FORCE;
          p.canDoubleJump = false;
        }
      } else if (e.code === 'ArrowDown') {
        if (!p.isJumping) {
          p.isSliding = true;
          p.height = 25;
          p.y = GROUND_Y - 25;
        } else {
          p.vy += 5; // Fast fall
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const p = state.current.player;
      if (e.code === 'ArrowDown') {
        p.isSliding = false;
        p.height = 50;
        if (!p.isJumping) p.y = GROUND_Y - 50;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      sound.init();
      if (isPaused) return;
      const p = state.current.player;
      const touchY = e.touches[0].clientY;
      const screenH = window.innerHeight;
      
      if (touchY > screenH / 2) {
        // Slide
        if (!p.isJumping) {
          p.isSliding = true;
          p.height = 25;
          p.y = GROUND_Y - 25;
        }
      } else {
        // Jump
        if (!p.isJumping) {
          sound.jump();
          p.vy = JUMP_FORCE;
          p.isJumping = true;
          p.isSliding = false;
        } else if (p.canDoubleJump) {
          sound.jump();
          p.vy = JUMP_FORCE;
          p.canDoubleJump = false;
        }
      }
    };
    
    const handleTouchEnd = () => {
      const p = state.current.player;
      p.isSliding = false;
      p.height = 50;
      if (!p.isJumping) p.y = GROUND_Y - 50;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPaused]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      if (isPaused) {
        requestRef.current = requestAnimationFrame(loop);
        return;
      }

      const s = state.current;
      s.frames++;
      
      // Increase speed slightly over time
      const speedIncrementFrames = difficulty === 'easy' ? 900 : difficulty === 'hard' ? 400 : 600;
      if (s.frames % speedIncrementFrames === 0 && s.speed < MAX_SPEED) {
        s.speed += 0.5;
      }

      // Update Power Timer
      if (s.powerTimer > 0) {
        s.powerTimer--;
        if (s.powerTimer === 0) {
          s.player.magnetActive = false;
          s.player.invincibleActive = false;
          s.player.multiplierActive = false;
        }
      }

      // Physics
      const p = s.player;
      p.vy += GRAVITY;
      p.y += p.vy;

      if (p.y + p.height >= GROUND_Y) {
        p.y = GROUND_Y - p.height;
        p.vy = 0;
        p.isJumping = false;
        p.canDoubleJump = character.power === 'doubleJump';
      }

      // Spawning
      if (s.frames % Math.floor(100 / (s.speed / baseSpeed)) === 0) {
        const rand = Math.random();
        if (rand < 0.6) {
          // Obstacle
          const randType = Math.random();
          let obsY, obsH, obsType;
          if (randType < 0.33) {
            obsY = GROUND_Y - 40;
            obsH = 40;
            obsType = 'low';
          } else if (randType < 0.66) {
            obsY = GROUND_Y - 80;
            obsH = 80;
            obsType = 'high';
          } else {
            obsY = GROUND_Y - 80;
            obsH = 40;
            obsType = 'floating';
          }
          
          s.obstacles.push({
            x: canvas.width,
            y: obsY,
            width: 30,
            height: obsH,
            type: obsType,
            passed: false
          });
        } else if (rand < 0.9) {
          // Coins
          for (let i = 0; i < 3; i++) {
            s.coins.push({
              x: canvas.width + i * 30,
              y: GROUND_Y - 30 - (Math.random() * 50),
              width: 15,
              height: 15,
              collected: false
            });
          }
        } else {
          // Question Token
          s.tokens.push({
            x: canvas.width,
            y: GROUND_Y - 60,
            width: 30,
            height: 30,
            collected: false
          });
        }
      }

      // Update Entities
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= s.speed;

        // Collision
        if (
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < obs.y + obs.height &&
          p.y + p.height > obs.y
        ) {
          if (p.invincibleActive) {
            sound.destroy();
            // Destroy obstacle
            s.obstacles.splice(i, 1);
            // Create particles
            for(let j=0; j<15; j++) {
              s.particles.push({
                x: obs.x + obs.width/2,
                y: obs.y + obs.height/2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 1) * 8,
                life: 30 + Math.random() * 20,
                maxLife: 50,
                color: obs.type === 'floating' ? '#f97316' : '#ef4444',
                size: Math.random() * 8 + 4,
                type: 'debris',
                gravity: 0.4
              });
            }
          } else if (p.shieldActive) {
            sound.break();
            p.shieldActive = false;
            s.obstacles.splice(i, 1);
            // Shield break effect
            for(let j=0; j<20; j++) {
              s.particles.push({
                x: p.x + p.width/2,
                y: p.y + p.height/2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 20 + Math.random() * 20,
                maxLife: 40,
                color: '#60a5fa',
                size: Math.random() * 6 + 2,
                type: 'sparkle',
                gravity: 0.2
              });
            }
          } else if (p.extraLifeActive) {
            sound.break();
            p.extraLifeActive = false;
            p.invincibleActive = true;
            s.powerTimer = 60; // 1 second of invincibility
            s.obstacles.splice(i, 1);
            // Extra life effect
            for(let j=0; j<20; j++) {
              s.particles.push({
                x: p.x + p.width/2,
                y: p.y + p.height/2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 20 + Math.random() * 20,
                maxLife: 40,
                color: '#f8fafc',
                size: Math.random() * 6 + 2,
                type: 'sparkle',
                gravity: 0.2
              });
            }
          } else {
            sound.hit();
            sound.gameOver();
            sound.stopBGM();
            // Game Over
            onGameOver(s.score, s.coinsCollected);
            return; // Stop loop
          }
        }

        if (!obs.passed && obs.x + obs.width < p.x) {
          obs.passed = true;
          s.score += 10 * (p.multiplierActive ? 2 : 1);
        }

        if (obs.x + obs.width < 0) s.obstacles.splice(i, 1);
      }

      for (let i = s.coins.length - 1; i >= 0; i--) {
        const coin = s.coins[i];
        
        // Magnet effect
        if (p.magnetActive) {
          const dx = (p.x + p.width/2) - (coin.x + coin.width/2);
          const dy = (p.y + p.height/2) - (coin.y + coin.height/2);
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            coin.x += dx * 0.1;
            coin.y += dy * 0.1;
          } else {
            coin.x -= s.speed;
          }
        } else {
          coin.x -= s.speed;
        }

        if (
          !coin.collected &&
          p.x < coin.x + coin.width &&
          p.x + p.width > coin.x &&
          p.y < coin.y + coin.height &&
          p.y + p.height > coin.y
        ) {
          sound.coin();
          coin.collected = true;
          s.coinsCollected++;
          const points = 5 * (p.multiplierActive ? 2 : 1);
          s.score += points;
          s.coins.splice(i, 1);
          // Particle burst
          for(let j=0; j<8; j++) {
            s.particles.push({
              x: coin.x + coin.width/2,
              y: coin.y + coin.height/2,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              life: 20 + Math.random() * 10,
              maxLife: 30,
              color: '#fef08a',
              size: Math.random() * 4 + 2,
              type: 'sparkle',
              gravity: 0.1
            });
          }
          // Floating text
          s.particles.push({
            x: coin.x,
            y: coin.y,
            vx: 0,
            vy: -2,
            life: 40,
            maxLife: 40,
            color: '#eab308',
            type: 'text',
            text: `+${points}`,
            gravity: 0
          });
        } else if (coin.x + coin.width < 0) {
          s.coins.splice(i, 1);
        }
      }

      for (let i = s.tokens.length - 1; i >= 0; i--) {
        const token = s.tokens[i];
        token.x -= s.speed;

        if (
          !token.collected &&
          p.x < token.x + token.width &&
          p.x + p.width > token.x &&
          p.y < token.y + token.height &&
          p.y + p.height > token.y
        ) {
          token.collected = true;
          s.tokens.splice(i, 1);
          
          if (character.power === 'skipQuestion') {
            sound.correct();
            s.score += 500;
            s.powerTimer = 300;
            p.invincibleActive = true;
            
            s.particles.push({
              x: token.x,
              y: token.y,
              vx: 0,
              vy: -2,
              life: 40,
              maxLife: 40,
              color: '#f472b6',
              type: 'text',
              text: 'PULOU! +500',
              gravity: 0
            });
          } else {
            // Trigger a question
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            onQuestionTrigger(randomQuestion);
          }
        } else if (token.x + token.width < 0) {
          s.tokens.splice(i, 1);
        }
      }
      
      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const part = s.particles[i];
        part.vy += part.gravity || 0;
        part.x += part.vx;
        part.y += part.vy;
        part.life--;
        if (part.life <= 0) s.particles.splice(i, 1);
      }

      s.distance += s.speed / 10;
      s.score += (s.speed / 10) * (p.multiplierActive ? 2 : 1);

      // Rendering
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine Scenario (changes every 30,000 points)
      const scenarioIndex = Math.floor(s.score / 30000) % 5;
      
      if (scenarioIndex === 0) {
        // City
        ctx.fillStyle = '#87CEEB'; // Sky
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);
        
        ctx.fillStyle = '#94a3b8'; // Buildings
        const bgOffset = (s.distance * 2) % 100;
        for(let i=-1; i<canvas.width/100 + 1; i++) {
          const h = 100 + (Math.sin(i*123) * 50);
          ctx.fillRect(i*100 - bgOffset, GROUND_Y - h, 80, h);
        }

        ctx.fillStyle = '#334155'; // Ground
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
        
        ctx.fillStyle = '#475569'; // Ground lines
        const fgOffset = (s.distance * 10) % 40;
        for(let i=-1; i<canvas.width/40 + 1; i++) {
          ctx.fillRect(i*40 - fgOffset, GROUND_Y + 10, 20, 5);
        }
      } else if (scenarioIndex === 1) {
        // Forest
        ctx.fillStyle = '#dcfce7'; // Sky
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);
        
        ctx.fillStyle = '#22c55e'; // Trees
        const bgOffset = (s.distance * 2) % 120;
        for(let i=-1; i<canvas.width/120 + 1; i++) {
          const h = 120 + (Math.sin(i*321) * 40);
          ctx.beginPath();
          ctx.moveTo(i*120 - bgOffset + 40, GROUND_Y - h);
          ctx.lineTo(i*120 - bgOffset + 80, GROUND_Y);
          ctx.lineTo(i*120 - bgOffset, GROUND_Y);
          ctx.fill();
        }

        ctx.fillStyle = '#166534'; // Ground
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
        
        ctx.fillStyle = '#14532d'; // Ground lines
        const fgOffset = (s.distance * 10) % 40;
        for(let i=-1; i<canvas.width/40 + 1; i++) {
          ctx.fillRect(i*40 - fgOffset, GROUND_Y + 10, 20, 5);
        }
      } else if (scenarioIndex === 2) {
        // Desert
        ctx.fillStyle = '#fef08a'; // Sky
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);
        
        ctx.fillStyle = '#eab308'; // Dunes
        const bgOffset = (s.distance * 2) % 200;
        for(let i=-1; i<canvas.width/200 + 1; i++) {
          const h = 80 + (Math.sin(i*456) * 30);
          ctx.beginPath();
          ctx.arc(i*200 - bgOffset + 100, GROUND_Y, h, Math.PI, 0);
          ctx.fill();
        }

        ctx.fillStyle = '#ca8a04'; // Ground
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
        
        ctx.fillStyle = '#a16207'; // Ground lines
        const fgOffset = (s.distance * 10) % 40;
        for(let i=-1; i<canvas.width/40 + 1; i++) {
          ctx.fillRect(i*40 - fgOffset, GROUND_Y + 10, 20, 5);
        }
      } else if (scenarioIndex === 3) {
        // Snow
        ctx.fillStyle = '#e0f2fe'; // Sky
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);
        
        ctx.fillStyle = '#bae6fd'; // Ice mountains
        const bgOffset = (s.distance * 2) % 150;
        for(let i=-1; i<canvas.width/150 + 1; i++) {
          const h = 150 + (Math.sin(i*789) * 60);
          ctx.beginPath();
          ctx.moveTo(i*150 - bgOffset + 75, GROUND_Y - h);
          ctx.lineTo(i*150 - bgOffset + 150, GROUND_Y);
          ctx.lineTo(i*150 - bgOffset, GROUND_Y);
          ctx.fill();
        }

        ctx.fillStyle = '#f8fafc'; // Ground
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
        
        ctx.fillStyle = '#cbd5e1'; // Ground lines
        const fgOffset = (s.distance * 10) % 40;
        for(let i=-1; i<canvas.width/40 + 1; i++) {
          ctx.fillRect(i*40 - fgOffset, GROUND_Y + 10, 20, 5);
        }
      } else {
        // Space
        ctx.fillStyle = '#0f172a'; // Sky
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);
        
        ctx.fillStyle = '#475569'; // Stars/Planets
        const bgOffset = (s.distance * 1) % 100;
        for(let i=-1; i<canvas.width/100 + 1; i++) {
          const y = 50 + (Math.sin(i*111) * 40);
          ctx.beginPath();
          ctx.arc(i*100 - bgOffset + 50, y, 5 + (Math.sin(i*222)*3), 0, Math.PI*2);
          ctx.fill();
        }

        ctx.fillStyle = '#1e293b'; // Ground
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
        
        ctx.fillStyle = '#334155'; // Ground lines
        const fgOffset = (s.distance * 10) % 40;
        for(let i=-1; i<canvas.width/40 + 1; i++) {
          ctx.fillRect(i*40 - fgOffset, GROUND_Y + 10, 20, 5);
        }
      }

      // Draw Player (Realistic Emoji Skin)
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

      const emoji = character.emoji || '🏃';

      // Most animal emojis face left, so we flip them to face right (the direction of running)
      ctx.scale(-1, 1);

      const isRunning = !p.isJumping && !p.isSliding;
      const swing = isRunning ? Math.sin(s.frames * 0.5) : 0;
      
      // Add a subtle shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      if (!p.isJumping) {
        ctx.beginPath();
        ctx.ellipse(0, p.height / 2 - 2, 15 + Math.abs(swing)*5, 4, 0, 0, Math.PI*2);
        ctx.fill();
      }

      // Reset fillStyle so emoji is fully opaque
      ctx.fillStyle = '#000000';
      ctx.font = '44px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (p.isSliding) {
        // When sliding, rotate forward (nose down)
        ctx.rotate(Math.PI / 4);
        ctx.fillText(emoji, 0, 10);
      } else if (p.isJumping) {
        // When jumping, tilt up (nose up)
        ctx.rotate(-Math.PI / 8);
        ctx.fillText(emoji, 0, 0);
      } else {
        // Running bob
        ctx.rotate(swing * 0.1);
        ctx.fillText(emoji, 0, -Math.abs(swing) * 5);
      }
      
      ctx.restore();
      
      // Shield visual
      if (p.shieldActive) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x + p.width/2, p.y + p.height/2, Math.max(p.width, p.height)/2 + 5, 0, Math.PI*2);
        ctx.stroke();
      }
      
      // Invincible visual
      if (p.invincibleActive) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(s.frames * 0.5) * 0.5 + 0.5})`;
        ctx.fillRect(p.x-2, p.y-2, p.width+4, p.height+4);
      }

      // Draw Obstacles
      s.obstacles.forEach(obs => {
        if (obs.type === 'floating') {
          ctx.fillStyle = '#f97316'; // Orange for floating
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          // Draw some wings or thrusters
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(obs.x - 5, obs.y + 10, 10, 5);
          ctx.fillRect(obs.x + obs.width - 5, obs.y + 10, 10, 5);
          // blinking light
          ctx.fillStyle = (s.frames % 20 < 10) ? '#ef4444' : '#000';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width/2, obs.y + obs.height - 5, 3, 0, Math.PI*2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ef4444'; // Red obstacles
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          // Warning stripes
          ctx.fillStyle = '#000';
          ctx.fillRect(obs.x, obs.y + 10, obs.width, 5);
          ctx.fillRect(obs.x, obs.y + 20, obs.width, 5);
        }
      });

      // Draw Coins
      ctx.fillStyle = '#eab308';
      s.coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw Tokens
      ctx.fillStyle = '#a855f7'; // Purple token
      s.tokens.forEach(token => {
        ctx.fillRect(token.x, token.y, token.width, token.height);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', token.x + token.width/2, token.y + token.height/2 + 7);
        ctx.fillStyle = '#a855f7';
      });
      
      // Draw Particles
      s.particles.forEach(part => {
        ctx.globalAlpha = Math.max(0, part.life / (part.maxLife || 30));
        ctx.fillStyle = part.color || '#fff';
        
        if (part.type === 'text') {
          ctx.font = 'bold 20px Arial';
          ctx.fillText(part.text, part.x, part.y);
        } else if (part.type === 'sparkle') {
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size || 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // debris / default
          ctx.save();
          ctx.translate(part.x, part.y);
          ctx.rotate(part.life * 0.2);
          const sz = part.size || 4;
          ctx.fillRect(-sz/2, -sz/2, sz, sz);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      });

      // Draw HUD
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Pontos: ${Math.floor(s.score)}`, 20, 30);
      ctx.fillText(`Moedas: ${s.coinsCollected}`, 20, 60);
      
      if (s.powerTimer > 0) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`Poder Ativo!`, canvas.width / 2 - 50, 30);
        // Power bar
        ctx.fillRect(canvas.width / 2 - 50, 40, (s.powerTimer / 300) * 100, 10);
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, character, onGameOver, onQuestionTrigger]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-2xl border-4 border-slate-700"
      style={{ touchAction: 'none' }}
    />
  );
}

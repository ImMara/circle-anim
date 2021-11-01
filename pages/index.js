import Head from 'next/head';
import { gsap } from "gsap";
import { useRef,useEffect } from 'react';

export default function Home() {

    // reference
    const boxRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        gsap.to(boxRef.current,{ rotation: "+=360" })

        // canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = innerWidth;
        canvas.height = innerHeight;

        const w = canvas.width;
        const h = canvas.height;

        // Variables
        const mouse = {
            x: w / 2,
            y: h / 2
        }

        const colors = [
            '#2185C5',
            '#7ECEFD',
            '#FFF6E5',
            '#FF7F66'
        ]

        // Event listeners
        addEventListener('mousemove', event => {
            mouse.x = event.clientX
            mouse.y = event.clientY
        })
        addEventListener('resize',()=>{
          canvas.width = innerWidth;
          canvas.height = innerHeight;
          init();
        })

        // Utility functions
        function randomIntFromRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        function randomColor(colors) {
            return colors[Math.floor(Math.random() * colors.length)]
        }

        // Objects
        function Particle(x,y,radius,color){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.radians = Math.random() * Math.PI *2;
            this.velocity = 0.05;
            this.distanceFromCenter = randomIntFromRange(50,150);
            this.lastMouse = { x: x , y : y};

            this.update = ()=>{
                const lastPoint = { x : this.x , y : this.y };

                // move points over time 
                this.radians += this.velocity;

                // Drag effect
                this.lastMouse.x += (mouse.x - this.lastMouse.x)* this.velocity;
                this.lastMouse.y += (mouse.y - this.lastMouse.y)* this.velocity;
              

                // circular motion
                this.x = this.lastMouse.x + Math.cos(this.radians)* this.distanceFromCenter;
                this.y = this.lastMouse.y + Math.sin(this.radians)* this.distanceFromCenter;
                this.draw(lastPoint);
            }

            this.draw = lastPoint => {
                ctx.beginPath();
                // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                // ctx.fillStyle = this.color;
                // ctx.fill();
                ctx.strokeStyle = this.color;
                ctx.lineWidth= this.radius;
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // Implementation
        let particles;
        function init(){
          particles = []
          for(let i = 0; i < 50; i++){
            const radius = (Math.random() * 2)+1;
            // object push
            particles.push(new Particle(w/2, h/2, radius, randomColor(colors)))
          }
          console.log(particles);
        }

        // Animation Loop<
        function animate() {
            requestAnimationFrame(animate)
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fillRect(0,0 , w , h);
            // ctx.clearRect(0, 0, w, h)
            // ctx.fillText('HTML CANVAS BOILERPLATE',mouse.x,mouse.y);
            particles.forEach(particle => particle.update())
        }

        init();
        animate();

    })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex static flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {/*<div ref={boxRef}>Hello</div>*/}
        <canvas className="absolute" ref={canvasRef}/>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}

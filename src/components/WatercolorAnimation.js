import React, { useEffect, useRef } from 'react';

const WatercolorAnimation = () => {
    const canvasRef = useRef(null);
    const twoPI = 2 * Math.PI;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const resizeCanvas = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            drawWatercolors();
        };

        window.addEventListener('resize', resizeCanvas);

        const randomWiggle = (wiggle) => {
            return Math.random() * wiggle * (Math.random() < 0.1 ? -1 : 1);
        };

        let color = -25;
        const randomColor = () => {
            color = Math.floor((color % 360) + 25 + 15 * Math.random());
            return `hsl(${color}, 50%, 55%)`;
        };

        const WaterColor = function (options) {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    this[key] = options[key];
                }
            }
            if (!this.fill) {
                this.fill = randomColor();
            }
            this.c = Math.floor(Math.random() * 5);
            this.render();
        };

        WaterColor.prototype = {
            sides: 6,
            x: 20,
            y: 20,
            ctx: false,
            speed: 0.3,
            maxPoints: 3000,
            maxRender: 5,
            scale: false,

            buildPoints() {
                const wiggle = this.size * 0.15;
                let rotation = 0.15;
                let x = -this.size;
                let y = 0;
                const horizontal = Math.random() > 0.5;
                const start = [x, y];
                this.points = [start];
                for (; rotation < twoPI; rotation += this.speed) {
                    x += this.size * this.speed * Math.sin(rotation) * (horizontal ? 1 : 0.7) + randomWiggle(wiggle);
                    y += this.size * this.speed * Math.cos(rotation) * (horizontal ? 0.7 : 1) + randomWiggle(wiggle);
                    this.points.push([x, y]);
                }
                this.points.push(start);
                this.originalPoints = this.points;
                return this.points;
            },

            expandPoints() {
                if (!this.points) {
                    return this.buildPoints();
                }
                if (this.points.length > this.maxPoints) {
                    return false;
                }
                const wiggle = this.size * 0.035;
                const swirlFactor = 0.05; 
                const p = [];
                for (let i = 0, len = this.points.length - 1; i < len; i++) {
                    const y = this.points[i][1];
                    const x = this.points[i][0];
                    const y2 = this.points[i + 1][1];
                    const x2 = this.points[i + 1][0];
                    const midX = (x2 + x) / 2 + randomWiggle(wiggle);
                    const midY = (y2 + y) / 2 + randomWiggle(wiggle);
                    const swirlX = midX + swirlFactor * Math.sin(i);
                    const swirlY = midY + swirlFactor * Math.cos(i);
                    p.push([x, y], [swirlX, swirlY], [x2, y2]);
                }
                this.points = p;
                return true;
            },

            c: 0,

            render() {
                this.c++;
                if (this.c < this.maxRender * 3) {
                    requestAnimationFrame(this.render.bind(this));
                }
                if (this.c % 3 === 0) {
                    this.draw(this.c / 3);
                }
            },

            draw(c) {
                if (this.ctx) {
                    while (this.expandPoints()) { }
                    const ctx = this.ctx;
                    const itr = c / this.maxRender;
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.globalCompositeOperation = 'hard-light';
                    ctx.globalAlpha = 0.25 - itr * 0.1;
                    ctx.translate(this.x, this.y);
                    if (this.scale) {
                        ctx.scale(1 + itr * 0.2, 1 + itr * 0.2);
                    }
                    ctx.beginPath();
                    ctx.moveTo(this.points[0][0], this.points[0][1]);
                    for (let i = 0, len = this.points.length; i < len; i++) {
                        ctx.lineTo(this.points[i][0], this.points[i][1]);
                    }
                    ctx.closePath();
                    ctx.fillStyle = this.fill;
                    ctx.fill();
                    this.points = this.originalPoints;
                }
                return this;
            }
        };

        const drawWatercolors = () => {
            ctx.clearRect(0, 0, width, height); // Clear the canvas
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            for (let i = 0, len = 20; i < len; i++) {
                new WaterColor({
                    ctx: ctx,
                    size: width * (0.7 + Math.random() * 0.1),
                    x: halfWidth + Math.cos((i / len) * twoPI) * halfWidth,
                    y: halfHeight + Math.sin((i / len) * twoPI) * halfHeight
                });
            }
        };

        drawWatercolors();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [twoPI]);


    return <canvas ref={canvasRef} style={{ position: 'relative', borderRadius: '0.5rem', top: 0, left: 0, zIndex: 1 }} />;
};

export default WatercolorAnimation;
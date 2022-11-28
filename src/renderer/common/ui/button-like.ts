
import { LitElement, css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('button-like')
export class ButtonLike extends LitElement {

    @property({ attribute: false })
    disabled?: boolean;

    @property({ attribute: false })
    loading?: boolean;

    @query('.wrapper')
    wrapper?: HTMLDivElement;

    @query('.wrapper')
    button?: HTMLDivElement;

    onMouseDown(event: MouseEvent) {
        if (this.wrapper && this.button && !this.disabled) {
            const rect = this.button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const ripple = document.createElement('div');
            ripple.classList.add('touch');
            const ripple_child = document.createElement('div');
            ripple_child.classList.add('touch-child');
            ripple.appendChild(ripple_child);
            const size = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
            ripple.style.width = (size * 2) + 'px';
            ripple.style.height = (size * 2) + 'px';
            ripple.style.left = (x - size) + 'px';
            ripple.style.top = (y - size) + 'px';
            this.wrapper.appendChild(ripple);
        }
    }

    onMouseUpOrLeave() {
        if (this.wrapper) {
            this.wrapper.childNodes.forEach(child => {
                const ripple = child as HTMLDivElement;
                if (!ripple.classList.contains('touch-exit')) {
                    ripple.classList.add('touch-exit');
                    ripple.addEventListener('animationend', () => {
                        this.wrapper?.removeChild(ripple);
                    });
                }
            });
        }
    }

    static get styles() {
        return css`
            .button {
                background: transparent;
                transition: var(--transition);
                transition-property: background; 
                position: relative;
                border-radius: inherit;
            }
            .button.enabled:hover, .button.enabled:focus-within {
                background: var(--settings-hover-background);
            }
            .button.loading {
                animation: loading-keyframes 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes loading-keyframes {
                0%, 100% {
                    opacity: 1.0;
                }
                50% {
                    opacity: 0.25;
                }
            }
            .wrapper {
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 0;
                overflow: hidden;
                position: absolute;
                border-radius: inherit;
                pointer-events: none;
            }
            .touch {
                position: absolute;
                opacity: 0.15;
                transform: scale(1);
                position: absolute;
                animation: enter-keyframes 550ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes enter-keyframes {
                0% {
                    opacity: 0.05;
                    transform: scale(0);
                }
                100% {
                    opacity: 0.15;
                    transform: scale(1);
                }
            }
            .touch-child {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: currentColor;
            }
            .touch-exit .touch-child {
                opacity: 0;
                animation: exit-keyframes 550ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes exit-keyframes {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        `;
    }

    render() {
        const classes = classMap({
            'enabled': !this.disabled,
            'disabled': this.disabled ? true : false,
            'loading': this.loading ? true : false,
        });
        return html`
            <div
                class="button ${classes}"
                @mousedown="${this.onMouseDown}"
                @mouseup="${this.onMouseUpOrLeave}"
                @mouseleave="${this.onMouseUpOrLeave}"
            >
                <div class="wrapper"></div>
                <slot></slot>
            </div>
        `;
    }
}


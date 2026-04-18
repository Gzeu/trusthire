/// <reference types="react" />

declare global namespace React {
    // Touch Events
    interface TouchEvent extends UIEvent {
      readonly changedTouches: TouchList;
      readonly targetTouches: TouchList;
      readonly touches: TouchList;
    }

    interface Touch {
      readonly identifier: number;
      readonly pageX: number;
      readonly pageY: number;
      readonly clientX: number;
      readonly clientY: number;
      readonly radiusX: number;
      readonly radiusY: number;
      readonly rotationAngle: number;
      readonly force: number;
      readonly target: EventTarget;
      readonly timestamp: number;
    }

    interface TouchList {
      readonly length: number;
      item(index: number): Touch;
      [index: number]: Touch;
    }

    // Touch Event Init
    interface TouchEventInit extends UIEventInit {
      changedTouches?: TouchList;
      targetTouches?: TouchList;
    }

    // Pointer Events
    interface PointerEvent extends UIEvent {
      readonly pointerId: number;
      readonly width: number;
      readonly height: number;
      readonly pressure: number;
      readonly tangentialPressure: number;
      readonly tiltX: number;
      readonly tiltY: number;
      readonly twist: number;
      readonly pointerType: string;
      readonly isPrimary: boolean;
    }

    // Pointer Event Init
    interface PointerEventInit extends UIEventInit {
      pointerId?: number;
      width?: number;
      height?: number;
      pressure?: number;
      tangentialPressure?: number;
      tiltX?: number;
      tiltY?: number;
      twist?: number;
      pointerType?: string;
      isPrimary?: boolean;
    }

    // Client Events
    interface ClientX extends UIEvent {
      readonly clientX: number;
      readonly clientY: number;
    }

    interface ClientY extends UIEvent {
      readonly clientX: number;
      readonly clientY: number;
    }

    // Page Events
    interface PageX extends UIEvent {
      readonly pageX: number;
      readonly pageY: number;
    }

    interface PageY extends UIEvent {
      readonly pageX: number;
      readonly pageY: number;
    }

    // Screen Events
    interface ScreenX extends UIEvent {
      readonly screenX: number;
      readonly screenY: number;
    }

    interface ScreenY extends UIEvent {
      readonly screenX: number;
      readonly screenY: number;
    }

    // Wheel Events
    interface WheelEvent extends UIEvent {
      readonly deltaX: number;
      readonly deltaY: number;
      readonly deltaZ: number;
      readonly deltaMode: number;
    }

    interface WheelEventInit extends UIEventInit {
      deltaX?: number;
      deltaY?: number;
      deltaZ?: number;
      deltaMode?: number;
    }

    // Animation Events
    interface AnimationEvent extends UIEvent {
      readonly animationName: string;
      readonly elapsedTime: number;
      readonly pseudoElement: string;
    }

    interface AnimationEventInit extends UIEventInit {
      animationName?: string;
      elapsedTime?: number;
      pseudoElement?: string;
    }

    // Transition Events
    interface TransitionEvent extends UIEvent {
      readonly propertyName: string;
      readonly elapsedTime: number;
      readonly pseudoElement: string;
    }

    interface TransitionEventInit extends UIEventInit {
      propertyName?: string;
      elapsedTime?: number;
      pseudoElement?: string;
    }

    // Keyboard Events
    interface KeyboardEvent extends UIEvent {
      readonly altKey: boolean;
      readonly charCode: number;
      readonly code: string;
      readonly ctrlKey: boolean;
      readonly key: string;
      readonly location: number;
      readonly metaKey: boolean;
      readonly repeat: boolean;
      readonly shiftKey: boolean;
      readonly which: number;
    }

    interface KeyboardEventInit extends UIEventInit {
      altKey?: boolean;
      charCode?: number;
      code?: string;
      ctrlKey?: boolean;
      key?: string;
      location?: number;
      metaKey?: boolean;
      repeat?: boolean;
      shiftKey?: boolean;
      which?: number;
    }

    // Mouse Events
    interface MouseEvent extends UIEvent {
      readonly altKey: boolean;
      readonly button: number;
      readonly buttons: number;
      readonly clientX: number;
      readonly clientY: number;
      readonly ctrlKey: boolean;
      readonly metaKey: boolean;
      readonly movementX: number;
      readonly movementY: number;
      readonly offsetX: number;
      readonly offsetY: number;
      readonly pageX: number;
      readonly pageY: number;
      readonly relatedTarget: EventTarget;
      readonly screenX: number;
      readonly screenY: number;
      readonly shiftKey: boolean;
      readonly time: number;
      readonly which: number;
    }

    interface MouseEventInit extends UIEventInit {
      altKey?: boolean;
      button?: number;
      buttons?: number;
      clientX?: number;
      clientY?: number;
      ctrlKey?: boolean;
      metaKey?: boolean;
      movementX?: number;
      movementY?: number;
      offsetX?: number;
      offsetY?: number;
      pageX?: number;
      pageY?: number;
      relatedTarget?: EventTarget;
      screenX?: number;
      screenY?: number;
      shiftKey?: boolean;
      time?: number;
      which?: number;
    }

    // Focus Events
    interface FocusEvent extends UIEvent {
      readonly relatedTarget: EventTarget;
    }

    interface FocusEventInit extends UIEventInit {
      relatedTarget?: EventTarget;
    }
  }
}

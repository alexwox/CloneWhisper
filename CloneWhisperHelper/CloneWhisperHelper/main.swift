import Cocoa
import ApplicationServices

func ensureAccessibilityAccess() {
    let checkOptionPrompt = kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String
    let options = [checkOptionPrompt: true] as CFDictionary
    let accessEnabled = AXIsProcessTrustedWithOptions(options)
    
    if !accessEnabled {
        fputs("Accessibility access not granted.\n", stderr)
        exit(1)
    }
}

func getFocusedElement() -> AXUIElement? {
    let systemWideElement = AXUIElementCreateSystemWide()
    var focusedElement: CFTypeRef?
    let result = AXUIElementCopyAttributeValue(systemWideElement, kAXFocusedUIElementAttribute as CFString, &focusedElement)
    
    if result == .success, let element = focusedElement {
        return (element as! AXUIElement)
    }
    return nil
}

func isElementEditable(_ element: AXUIElement) -> Bool {
    var role: CFTypeRef?
    if AXUIElementCopyAttributeValue(element, kAXRoleAttribute as CFString, &role) == .success {
        if let role = role as? String {
            return role == kAXTextFieldRole || role == kAXTextAreaRole
        }
    }
    return false
}

func pasteClipboardToElement(_ element: AXUIElement) -> Bool {
    let pasteboard = NSPasteboard.general
    guard let clipboardString = pasteboard.string(forType: .string) else {
        fputs("Clipboard does not contain a string.\n", stderr)
        return false
    }
    
    let error = AXUIElementSetAttributeValue(element, kAXValueAttribute as CFString, clipboardString as CFTypeRef)
    if error == .success {
        return true
    } else {
        fputs("Failed to set value: \(error.rawValue)\n", stderr)
        return false
    }
}

// --- Main Program Starts Here ---

ensureAccessibilityAccess()

guard let focusedElement = getFocusedElement() else {
    fputs("No focused element found.\n", stderr)
    exit(2)
}

guard isElementEditable(focusedElement) else {
    fputs("Focused element is not a text input field.\n", stderr)
    exit(2)
}

guard pasteClipboardToElement(focusedElement) else {
    fputs("Failed to paste clipboard contents into input field.\n", stderr)
    exit(3)
}

// Success
print("Pasted clipboard content successfully.")
exit(0)

import Foundation
import Cocoa
import CoreGraphics

func createMacMailIcon() -> NSImage {
    let size = CGSize(width: 1024, height: 1024)
    let image = NSImage(size: size)
    
    image.lockFocus()
    guard let ctx = NSGraphicsContext.current?.cgContext else {
        image.unlockFocus()
        return image
    }
    
    // Clear
    ctx.clear(CGRect(origin: .zero, size: size))
    
    // Draw Squircle Background (macOS standard app icon shape)
    let squircleRect = CGRect(x: 100, y: 100, width: 824, height: 824)
    let squirclePath = CGPath(roundedRect: squircleRect, cornerWidth: 185, cornerHeight: 185, transform: nil)
    
    // Shadow behind squircle
    ctx.saveGState()
    ctx.setShadow(offset: CGSize(width: 0, height: -20), blur: 35, color: CGColor(red: 0, green: 0, blue: 0, alpha: 0.35))
    ctx.addPath(squirclePath)
    ctx.setFillColor(CGColor(red: 0.05, green: 0.1, blue: 0.2, alpha: 1.0))
    ctx.fillPath()
    ctx.restoreGState()
    
    // Squircle Gradient Fill
    ctx.saveGState()
    ctx.addPath(squirclePath)
    ctx.clip()
    
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let gradientColors = [
        CGColor(red: 0.08, green: 0.18, blue: 0.38, alpha: 1.0), // Deep blue top
        CGColor(red: 0.12, green: 0.35, blue: 0.75, alpha: 1.0), // Royal blue middle
        CGColor(red: 0.20, green: 0.55, blue: 0.95, alpha: 1.0)  // Bright cyan/blue bottom
    ] as CFArray
    let locations: [CGFloat] = [0.0, 0.55, 1.0]
    
    if let gradient = CGGradient(colorsSpace: colorSpace, colors: gradientColors, locations: locations) {
        ctx.drawLinearGradient(gradient, start: CGPoint(x: 512, y: 924), end: CGPoint(x: 512, y: 100), options: [])
    }
    
    // Inner border highlight / rim light
    ctx.setStrokeColor(CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.22))
    ctx.setLineWidth(4)
    ctx.addPath(squirclePath)
    ctx.strokePath()
    ctx.restoreGState()
    
    // Draw Stylized Modern Envelope
    let envelopeWidth: CGFloat = 520
    let envelopeHeight: CGFloat = 340
    let envX: CGFloat = (1024 - envelopeWidth) / 2
    let envY: CGFloat = (1024 - envelopeHeight) / 2 - 20
    
    // Envelope drop shadow
    ctx.saveGState()
    ctx.setShadow(offset: CGSize(width: 0, height: -16), blur: 30, color: CGColor(red: 0.02, green: 0.05, blue: 0.15, alpha: 0.45))
    
    // Envelope Back / Body
    let envBodyRect = CGRect(x: envX, y: envY, width: envelopeWidth, height: envelopeHeight)
    let envBodyPath = CGPath(roundedRect: envBodyRect, cornerWidth: 36, cornerHeight: 36, transform: nil)
    ctx.addPath(envBodyPath)
    ctx.setFillColor(CGColor(red: 0.96, green: 0.97, blue: 1.0, alpha: 1.0))
    ctx.fillPath()
    ctx.restoreGState()
    
    // Envelope Body Gradient Clip
    ctx.saveGState()
    ctx.addPath(envBodyPath)
    ctx.clip()
    
    let envColors = [
        CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0),
        CGColor(red: 0.90, green: 0.93, blue: 0.98, alpha: 1.0)
    ] as CFArray
    if let envGrad = CGGradient(colorsSpace: colorSpace, colors: envColors, locations: [0.0, 1.0]) {
        ctx.drawLinearGradient(envGrad, start: CGPoint(x: 512, y: envY + envelopeHeight), end: CGPoint(x: 512, y: envY), options: [])
    }
    
    // Diagonal Bottom Folds
    let foldPath = CGMutablePath()
    foldPath.move(to: CGPoint(x: envX, y: envY))
    foldPath.addLine(to: CGPoint(x: 512, y: envY + envelopeHeight * 0.46))
    foldPath.addLine(to: CGPoint(x: envX + envelopeWidth, y: envY))
    foldPath.addLine(to: CGPoint(x: envX + envelopeWidth, y: envY + 20))
    foldPath.addLine(to: CGPoint(x: envX, y: envY + 20))
    foldPath.closeSubpath()
    
    ctx.setFillColor(CGColor(red: 0.82, green: 0.86, blue: 0.94, alpha: 0.4))
    ctx.addPath(foldPath)
    ctx.fillPath()
    
    ctx.restoreGState()
    
    // Top Flap of the Envelope
    ctx.saveGState()
    ctx.setShadow(offset: CGSize(width: 0, height: -8), blur: 16, color: CGColor(red: 0.05, green: 0.12, blue: 0.28, alpha: 0.25))
    
    let flapPath = CGMutablePath()
    flapPath.move(to: CGPoint(x: envX + 10, y: envY + envelopeHeight - 5))
    flapPath.addLine(to: CGPoint(x: 512, y: envY + envelopeHeight * 0.38))
    flapPath.addLine(to: CGPoint(x: envX + envelopeWidth - 10, y: envY + envelopeHeight - 5))
    flapPath.closeSubpath()
    
    let flapColors = [
        CGColor(red: 0.98, green: 0.99, blue: 1.0, alpha: 1.0),
        CGColor(red: 0.88, green: 0.92, blue: 0.98, alpha: 1.0)
    ] as CFArray
    
    ctx.addPath(flapPath)
    ctx.clip()
    if let flapGrad = CGGradient(colorsSpace: colorSpace, colors: flapColors, locations: [0.0, 1.0]) {
        ctx.drawLinearGradient(flapGrad, start: CGPoint(x: 512, y: envY + envelopeHeight), end: CGPoint(x: 512, y: envY + envelopeHeight * 0.38), options: [])
    }
    
    ctx.restoreGState()
    
    // Flap Stroke line
    ctx.saveGState()
    ctx.addPath(flapPath)
    ctx.setStrokeColor(CGColor(red: 0.75, green: 0.82, blue: 0.92, alpha: 0.7))
    ctx.setLineWidth(3)
    ctx.strokePath()
    ctx.restoreGState()
    
    // Glowing Unified Inbox Accent Indicator (top right of envelope)
    let badgeCenter = CGPoint(x: envX + envelopeWidth - 40, y: envY + envelopeHeight + 35)
    let badgeRadius: CGFloat = 46
    
    ctx.saveGState()
    ctx.setShadow(offset: CGSize(width: 0, height: -4), blur: 18, color: CGColor(red: 0.0, green: 0.75, blue: 0.9, alpha: 0.6))
    
    let badgeRect = CGRect(x: badgeCenter.x - badgeRadius, y: badgeCenter.y - badgeRadius, width: badgeRadius * 2, height: badgeRadius * 2)
    ctx.addEllipse(in: badgeRect)
    ctx.setFillColor(CGColor(red: 0.0, green: 0.82, blue: 0.98, alpha: 1.0))
    ctx.fillPath()
    
    // Inner badge highlight
    ctx.setStrokeColor(CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.8))
    ctx.setLineWidth(3)
    ctx.addEllipse(in: badgeRect)
    ctx.strokePath()
    
    // Badge symbol: clean checkmark or @ symbol or spark
    let badgeInner = CGMutablePath()
    badgeInner.move(to: CGPoint(x: badgeCenter.x - 16, y: badgeCenter.y))
    badgeInner.addLine(to: CGPoint(x: badgeCenter.x - 4, y: badgeCenter.y - 12))
    badgeInner.addLine(to: CGPoint(x: badgeCenter.x + 16, y: badgeCenter.y + 12))
    ctx.addPath(badgeInner)
    ctx.setStrokeColor(CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0))
    ctx.setLineWidth(6)
    ctx.setLineCap(.round)
    ctx.setLineJoin(.round)
    ctx.strokePath()
    
    ctx.restoreGState()
    
    image.unlockFocus()
    return image
}

func saveImagePNG(_ image: NSImage, to url: URL, targetSize: Int) {
    let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: targetSize,
        pixelsHigh: targetSize,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    )!
    
    rep.size = NSSize(width: targetSize, height: targetSize)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    
    image.draw(in: NSRect(x: 0, y: 0, width: targetSize, height: targetSize),
               from: NSRect(origin: .zero, size: image.size),
               operation: .copy,
               fraction: 1.0)
    
    NSGraphicsContext.restoreGraphicsState()
    
    if let pngData = rep.representation(using: .png, properties: [:]) {
        try? pngData.write(to: url)
    }
}

// Generate all sizes
let fileManager = FileManager.default
let currentDir = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let buildDir = currentDir.appendingPathComponent("build")
let iconsetDir = buildDir.appendingPathComponent("icon.iconset")

try? fileManager.createDirectory(at: iconsetDir, withIntermediateDirectories: true, attributes: nil)

let icon = createMacMailIcon()

let sizes: [(String, Int)] = [
    ("icon_16x16.png", 16),
    ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32),
    ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128),
    ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256),
    ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512),
    ("icon_512x512@2x.png", 1024)
]

for (name, px) in sizes {
    let fileURL = iconsetDir.appendingPathComponent(name)
    saveImagePNG(icon, to: fileURL, targetSize: px)
}

// Also save build/icon.png
let masterPngURL = buildDir.appendingPathComponent("icon.png")
saveImagePNG(icon, to: masterPngURL, targetSize: 1024)

print("Generated iconset in \(iconsetDir.path)")

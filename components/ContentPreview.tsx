interface ContentPreviewProps {
    aspectRatio: string
    template: Template
    font: Font
    fontSize: string
    text: string
  }

  export const ContentPreview: React.FC<ContentPreviewProps> = ({
    aspectRatio,
    template,
    font,
    fontSize,
    text,
  }) => {
    const isGradientOrUrl = template.bg.startsWith("linear-gradient") || template.bg.startsWith("url(");
  
    return (
      <div
        className={`relative ${aspectRatio} ${
          aspectRatio === "aspect-[9/16]" ? "w-3/5 mx-auto" : "w-full"
        } overflow-hidden`}
      >
        <div
          className="absolute inset-0 flex items-center justify-center p-8"
          style={{
            backgroundImage: isGradientOrUrl ? template.bg : undefined, // For gradient or URL
            backgroundColor: !isGradientOrUrl ? template.bg : undefined, // For solid color
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p
            className={`${font.class} ${fontSize} text-center break-words max-w-full`}
            style={{ color: template.color }}
          >
            {text || "Enter your text to create beautiful social media content"}
          </p>
        </div>
      </div>
    );
  };
  
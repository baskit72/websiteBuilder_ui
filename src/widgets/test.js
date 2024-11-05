import React, { useState, useMemo } from 'react';
import '../style/TextWidget.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const TextWidget = ({ content = {}, onUpdate= () => {},onSave}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [widgetContent, setWidgetContent] = useState(content.content || '');
  const [bgColor, setBgColor] = useState(content.bgColor || '#ffffff');
  const [bgImage, setBgImage] = useState(content.bgImage || '');
  const [gradient, setGradient] = useState(content.gradient || '');
  const [backgroundImageBlur, setBackgroundImageBlur] = useState(content.backgroundImageBlur || 0); // Background image blur amount
  const [paddingTop, setPaddingTop] = useState(content.paddingTop || '20px');
  const [paddingBottom, setPaddingBottom] = useState(content.paddingBottom || '20px');
  const [paddingLeft, setPaddingLeft] = useState(content.paddingLeft || '20px');
  const [paddingRight, setPaddingRight] = useState(content.paddingRight || '20px');
  const [marginTop, setMarginTop] = useState(content.marginTop || '10px');
  const [marginBottom, setMarginBottom] = useState(content.marginBottom || '10px');
  const [marginLeft, setMarginLeft] = useState(content.marginLeft || '10px');
  const [marginRight, setMarginRight] = useState(content.marginRight || '10px');
  const [borderRadius, setBorderRadius] = useState(content.borderRadius || '5px');
  const [boxShadow, setBoxShadow] = useState(content.boxShadow || 'none');
  const [alignment, setAlignment] = useState(content.alignment || 'left');
  const [textType, setTextType] = useState(content.textType || 'paragraph');
  const [width, setWidth] = useState(content.width || '100%');
  const [blurLevel, setBlurLevel] = useState(content.blurLevel || 0); // Blur control
  const [bgSize, setBgSize] = useState(content.bgSize || 'cover'); // Background size control
  const [isTransparent, setIsTransparent] = useState(content.isTransparent || false); // New state for background transparency



  const handleContentChange = (newContent) => {
    setWidgetContent(newContent);
    onUpdate({ ...content, content: newContent }); // Notify parent
  };

  //const saveChanges = () => setIsEditing(false);
  const saveChanges = () => {
    const widgetData = {
      //widgetId: content.widgetId || `widget-${Date.now()}`,  // Assign ID if new
      //type: "TextWidget",  // Identify widget type for loading
      //this is the properties
        content: widgetContent,
        bgColor,
        bgImage,
        gradient,
        backgroundImageBlur,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        borderRadius,
        boxShadow,
        alignment,
        width,
        blurLevel,
        bgSize,
        textType,
        isTransparent, // Save transparency state

    };

    // Send this data to parent or save locally for canvas state
    onSave(widgetData);  // Call parent's save function
    setIsEditing(false);
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBgImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const widgetStyle = useMemo(() =>({
    backgroundColor: isTransparent ? 'rgba(0, 0, 0, 0)' : bgColor,
    backgroundImage: bgImage ? `url(${bgImage})` : gradient ? `linear-gradient(${gradient})` : 'none',
    backgroundSize: bgSize,
    backgroundPosition: 'center',
    backdropFilter: `blur(${backgroundImageBlur}px)`, // Apply background image blur effect
    backgroundRepeat: 'no-repeat',
    filter: `blur(${blurLevel}px)`, // Blur applied
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    borderRadius,
    boxShadow,
    textAlign: alignment,
    width,
    transition: '0.3s ease-in-out',
  }),[bgColor, isTransparent, bgImage, gradient, bgSize,
        backgroundImageBlur, blurLevel,
        paddingTop, paddingBottom, paddingLeft, paddingRight,
        marginTop, marginBottom, marginLeft, marginRight,
        borderRadius, boxShadow, alignment, width]);

  return (
    <div className="text-widget-container" style={widgetStyle} contenteditable={isEditing ? "false":"true"} resizable="true">
      {isEditing ? (
        <div className="text-widget-editor">
          <ReactQuill
            value={widgetContent}
            onChange={handleContentChange}
            modules={TextWidget.modules}
            formats={TextWidget.formats}
            placeholder="Write your content here..."
          />

          <label>Background Color:</label>
          {/*<input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />*/}
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={isTransparent} />

          <label>
            <input type="checkbox" checked={isTransparent} onChange={() => setIsTransparent(!isTransparent)} />
            Transparent Background
          </label>

          <label>Background Image:</label>
          <input type="file" onChange={handleImageUpload} />



           <label>Background Image Blur:</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={backgroundImageBlur}
                      onChange={(e) => setBackgroundImageBlur(e.target.value)}
           />
            {/* Display blur value */}

          <label>Gradient Background (optional):</label>
          <input
            type="color"
            placeholder="e.g., red, blue"
            value={gradient}
            onChange={(e) => setGradient(e.target.value)}
          />

          <label>Image Blur Level:</label>
          <input
            type="range"
            min="0"
            max="10"
            value={blurLevel}
            onChange={(e) => setBlurLevel(e.target.value)}
          />

          <label>Image Size:</label>
          <select value={bgSize} onChange={(e) => setBgSize(e.target.value)}>
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="100% 100%">Fit to Screen</option>
            <option value="repeat">Repeat</option>
          </select>

          <label>Text Alignment:</label>
          <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>

          <label>Text Type:</label>
          <select value={textType} onChange={(e) => setTextType(e.target.value)}>
            <option value="paragraph">Paragraph</option>
            <option value="heading">Heading</option>
            <option value="quote">Quote</option>
            <option value="list">List</option> {/* Additional text type option */}
          </select>

          <label>Width:</label>
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g., 100%, 500px"
          />

          <div className="padding-options">
            <label>Padding (px):</label>
            <input
              type="number"
              value={paddingTop.replace('px', '')}
              onChange={(e) => setPaddingTop(`${e.target.value}px`)}
              placeholder="Top"
            />
            <input
              type="number"
              value={paddingBottom.replace('px', '')}
              onChange={(e) => setPaddingBottom(`${e.target.value}px`)}
              placeholder="Bottom"
            />
            <input
              type="number"
              value={paddingLeft.replace('px', '')}
              onChange={(e) => setPaddingLeft(`${e.target.value}px`)}
              placeholder="Left"
            />
            <input
              type="number"
              value={paddingRight.replace('px', '')}
              onChange={(e) => setPaddingRight(`${e.target.value}px`)}
              placeholder="Right"
            />
          </div>

          <div className="margin-options">
            <label>Margin (px):</label>
            <input
              type="number"
              value={marginTop.replace('px', '')}
              onChange={(e) => setMarginTop(`${e.target.value}px`)}
              placeholder="Top"
            />
            <input
              type="number"
              value={marginBottom.replace('px', '')}
              onChange={(e) => setMarginBottom(`${e.target.value}px`)}
              placeholder="Bottom"
            />
            <input
              type="number"
              value={marginLeft.replace('px', '')}
              onChange={(e) => setMarginLeft(`${e.target.value}px`)}
              placeholder="Left"
            />
            <input
              type="number"
              value={marginRight.replace('px', '')}
              onChange={(e) => setMarginRight(`${e.target.value}px`)}
              placeholder="Right"
            />
          </div>

          <label>Border Radius (px):</label>
          <input
            type="number"
            value={borderRadius.replace('px', '')}
            onChange={(e) => setBorderRadius(`${e.target.value}px`)}
            placeholder="Border Radius"
          />

          <label>Box Shadow:</label>
          <input
            type="text"
            value={boxShadow}
            onChange={(e) => setBoxShadow(e.target.value)}
            placeholder="e.g., 2px 2px 5px #888888"
          />

          <button onClick={saveChanges}>Save</button>
        </div>
      ) : (
        <div className="text-widget-display" onDoubleClick={() => setIsEditing(true)}>
          {textType === 'heading' && <h2 dangerouslySetInnerHTML={{ __html: widgetContent }} />}
          {textType === 'paragraph' && <p dangerouslySetInnerHTML={{ __html: widgetContent }} />}
          {textType === 'quote' && <blockquote dangerouslySetInnerHTML={{ __html: widgetContent }} />}
          {textType === 'list' && (
            <ul>
              {widgetContent.split('\n').map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

/*
 Configure Quill.js modules and formats
TextWidget.modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

TextWidget.formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'bullet',
  'link',
  'image',
];*/

TextWidget.modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    [{ font: [] }], // Font family
    [{ size: ['small', false, 'large', 'huge'] }], // Font size
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet'}  , { list: 'check' } ],
    [{ list: 'custom-bullet', attributes: { 'list-style-type': ['disc', 'circle', 'square'] } }], // Custom bullet styles
    [{ align: [] }], // Alignment
    [{ indent: '-1' }, { indent: '+1' }], // Indentation
    ['blockquote', 'code-block'], // Blockquote and code block
    ['link', 'image'],
    ['clean'],
  ],
};

TextWidget.formats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'check', 'custom-bullet', 'align', 'indent',
  'blockquote', 'code-block', 'link', 'image',
];

export default TextWidget;

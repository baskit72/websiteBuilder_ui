import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles



const ImageWidget = ({content = {}, onUpdate= () => {}, canvasMode, onSave }) => {
  // Single state to toggle all tab visibility
    const [isEditing, setIsEditing] = useState(false);

  // State for tab visibility
    const [isGeneralOpen, setIsGeneralOpen] = useState(false);
    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);


  // General (Content Tab)
  const [image, setImage] = useState(content.image ||null);
  const [resolution, setResolution] = useState(content.resolution ||'Full');
  const [clickAction, setClickAction] = useState(content.clickAction ||'none');
  const [linkUrl, setLinkUrl] = useState(content.linkUrl ||'');

  // Style and Advanced Tabs
  const [alignment, setAlignment] = useState(content.alignment ||'center');
  const [filter, setFilter] = useState(content.filter ||'');
  const [opacity, setOpacity] = useState(content.opacity ||1);
  const [widgetContent, setWidgetContent] = useState(content.content || '');
  const [imageBorderRadius, setImageBorderRadius] = useState(content.imageBorderRadius || 0);
  const [boxBorderRadius, setBoxBorderRadius] = useState(content.boxBorderRadius || 0);
  const [margin, setMargin] = useState(content.margin ||{ top: 0, right: 0, bottom: 0, left: 0 });
  const [padding, setPadding] = useState(content.padding ||{ top: 0, right: 0, bottom: 0, left: 0 });
  const [width, setWidth] = useState(content.width ||'auto');
  const [height, setHeight] = useState(content.height || 'auto'); // New state for custom height
  const [alignSelf, setAlignSelf] = useState(content.alignSelf ||'center');
  const [order, setOrder] = useState(content.order ||0);
  const [position, setPosition] = useState(content.position ||'default');
  const [boxBoxShadow, setBoxBoxShadow] = useState( content.boxBoxShadow ||'none');
  const [imageBoxShadow, setImageBoxShadow] = useState( content.imageBoxShadow ||'none');
  const [isTransparent, setIsTransparent] = useState(content.isTransparent || false); // New state for background transparency
  const [bgColor, setBgColor] = useState(content.bgColor || '#ffffff');



   const handleContentChange = (newContent) => {
       setWidgetContent(newContent);
       onUpdate({ ...content, content: newContent }); // Notify parent
     };



  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
      }
    };



  const handleResolutionChange = (e) => {
    setResolution(e.target.value);
    if (e.target.value !== 'Custom') {
      setWidth('auto');
      setHeight('auto'); // Reset height when not custom
    }
  };


  // Save function
  const handleSave = () => {
    const widgetData = {
      image,
      filter,
      opacity,
      content: widgetContent,
      resolution,
      clickAction,
      linkUrl,
      alignment,
      imageBorderRadius,
      boxBorderRadius,
      margin,
      padding,
      width,
      height, // Save custom height
      alignSelf,
      order,
      boxBoxShadow,
      imageBoxShadow,
      position,
      isTransparent, // Save transparency state
      bgColor
    };
    // Call the parent onSave function with widgetData

    onSave(widgetData);

  };


// Map resolution options to width and height values
  const resolutionDimensions = {
    Thumbnail: { width: '150px', height: '150px' },
    Medium: { width: '300px', height: '300px' },
    Large: { width: '600px', height: '600px' },
    Full: { width: '100%', height: 'auto' },
    Custom: { width: width || 'auto', height: height || 'auto' }, // Custom allows user-defined width and height
  };

  const filters = [
      { value: 'none', label: 'None' },
      { value: 'grayscale(100%)', label: 'Grayscale' },
      { value: 'sepia(100%)', label: 'Sepia' },
      { value: 'blur(2px)', label: 'Blur' },
    ];


  const widgetStyle = useMemo(() => ({
    backgroundColor: isTransparent ? 'rgba(0, 0, 0, 0)' : bgColor,
    resolution,  // Use the selected resolution for the image size
    filter,
    opacity,
    cursor: clickAction === 'link' ? 'pointer' : 'default',  // Change cursor to pointer if clickAction is set to link
    textAlign: alignment,
    borderRadius: `${boxBorderRadius}px`,
    overflow: boxBorderRadius ? 'hidden' : 'visible',
    margin: `${margin?.top || 0}px ${margin?.right || 0}px ${margin?.bottom || 0}px ${margin?.left || 0}px`,
    padding: `${padding?.top || 0}px ${padding?.right || 0}px ${padding?.bottom || 0}px ${padding?.left || 0}px`,
    width,
    height, // Apply height from state
    alignSelf,
    order,
    boxShadow: `${boxBoxShadow}`,
    position: position === 'default' ? 'static' : position,
    transition: '0.3s ease-in-out',  // Smooth transition for style changes
  }), [
    bgColor,
    isTransparent,
    resolution,
    filter,
    opacity,
    clickAction,
    alignment,
    boxBorderRadius,
    margin,
    padding,
    width,
    height,
    alignSelf,
    order,
    boxBoxShadow,
    position
  ]);

  return (
    <div
      style={widgetStyle}
      className="image-widget-container"
    >
      {/* Display the image */}
      {image ? (
      <>
        <img
          src={image}
          alt="Selected"
          style={{
            ...resolutionDimensions[resolution], // Apply resolution dimensions
            borderRadius: `${imageBorderRadius}px`,
            boxShadow: `${imageBoxShadow}`,
            display: 'block',
            marginLeft: alignment === 'center' ? 'auto' : '0',
            marginRight: alignment === 'center' ? 'auto' : '0',
            cursor: clickAction === 'link' ? 'pointer' : 'default',
          }}
          onClick={() => {
            if (clickAction === 'popup') {
              alert('Image clicked!');
            } else if (clickAction === 'link' && linkUrl) {
              window.open(linkUrl, '_blank');
            }
          }}
        />
               <div dangerouslySetInnerHTML={{ __html: widgetContent }}></div>
         </>
      ) : (
        <p>No image selected</p>
      )}

      {/* Edit Image Button: Toggles All Tabs */}
      {canvasMode === 'edit' && (
        <button
          onClick={() => {
            if (isEditing) handleSave(); // Save when exiting edit mode
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Close Edit' : 'Edit Image'}
        </button>
      )}


      {/* General (Content) Tab */}
      {isEditing && (
        <div>
          <h4 onClick={() => setIsGeneralOpen(!isGeneralOpen)}>Content</h4>
          {isGeneralOpen && (
          <div>
          <label>Choose Image:</label>
          <input type="file" onChange={handleImageUpload} />

          <ReactQuill
                      value={widgetContent}
                      onChange={handleContentChange}
                      modules={ImageWidget.modules}
                      formats={ImageWidget.formats}
                      placeholder="Write your caption here..."
                      />




          <label>Image Resolution:</label>
                        <select value={resolution} onChange={handleResolutionChange}>
                          <option value="Thumbnail">Thumbnail</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                          <option value="Full">Full</option>
                          <option value="Custom">Custom</option>
                        </select>

                        {resolution === 'Custom' && (
                          <div className="custom-resolution-inputs">
                            <label>
                              Width:
                              <input
                                type="text"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="e.g., 400px or 50%"
                              />
                            </label>
                            <label>
                              Height:
                              <input
                                type="text"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="e.g., choose auto 300px or auto"
                              />
                            </label>
                          </div>
                        )}


          <label>Click Action:</label>
          <select value={clickAction} onChange={(e) => setClickAction(e.target.value)}>
            <option value="none">None</option>
            <option value="link">Link</option>
            <option value="popup">Popup</option>
          </select>

          {clickAction === 'link' && (
            <div>
              <label>Enter URL:</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}



          </div>
          )}
        </div>
      )}

      {/* Style Tab */}
      {isEditing && (
        <div>
         <h4 onClick={() => setIsStyleOpen(!isStyleOpen)}>Style</h4>
         {isStyleOpen && (
          <div>
          <label>Alignment: </label>
          <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>

          <label>Background Color: </label>
                    {/*<input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />*/}
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={isTransparent} />

          <label>
                      <input type="checkbox" checked={isTransparent} onChange={() => setIsTransparent(!isTransparent)} />
                      Transparent Background
                    </label>


          <label> Image Border Radius:  </label>
                      <input
                        type="number"
                        value={imageBorderRadius}
                        onChange={(e) => setImageBorderRadius(e.target.value)}
                      />

          <label>Box Border Radius:</label>
                      <input
                        type="number"
                        value={boxBorderRadius}
                        onChange={(e) => setBoxBorderRadius(e.target.value)}
                      />

          <label>filters: </label>
            <Select
              options={filters}
              onChange={(option) => setFilter(option.value)}
              placeholder="Select Filter"
            />

          <label>Opacity: </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={opacity}
                          onChange={(e) => setOpacity(e.target.value)}
                        />

        </div>
        )}
        </div>
      )}

      {/* Advanced Tab */}
      {isEditing && (
        <div>
          <h4 onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}>Advanced</h4>
          {isAdvancedOpen && (
          <div>
          <label>Margin:</label>
          <input type="number" value={margin.top} onChange={(e) => setMargin({ ...margin, top: e.target.value })} placeholder="Top" />
          <input type="number" value={margin.right} onChange={(e) => setMargin({ ...margin, right: e.target.value })} placeholder="Right" />
          <input type="number" value={margin.bottom} onChange={(e) => setMargin({ ...margin, bottom: e.target.value })} placeholder="Bottom" />
          <input type="number" value={margin.left} onChange={(e) => setMargin({ ...margin, left: e.target.value })} placeholder="Left" />

          <label>Padding:</label>
          <input type="number" value={padding.top} onChange={(e) => setPadding({ ...padding, top: e.target.value })} placeholder="Top" />
          <input type="number" value={padding.right} onChange={(e) => setPadding({ ...padding, right: e.target.value })} placeholder="Right" />
          <input type="number" value={padding.bottom} onChange={(e) => setPadding({ ...padding, bottom: e.target.value })} placeholder="Bottom" />
          <input type="number" value={padding.left} onChange={(e) => setPadding({ ...padding, left: e.target.value })} placeholder="Left" />

          {/*<label>Width:</label>
          <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 100% 0r 100px or auto"/>

          <label>Height:</label>
          <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 100% 0r 100px or auto"/> {/* Added height input */}


          <label>Align Self:</label>
          <select value={alignSelf} onChange={(e) => setAlignSelf(e.target.value)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="stretch">Stretch</option>
          </select>

          <label>Order:</label>
          <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />

          <label>Position:</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="default">Default</option>
            <option value="absolute">Absolute</option>
            <option value="relative">Relative</option>
          </select>

          <label>Box Shadow: </label>
                    <input
                      type="text"
                      value={boxBoxShadow}
                      onChange={(e) => setBoxBoxShadow(e.target.value)}
                      placeholder="e.g., 2px 2px 5px #888888"
                    />

          <label>Image Box Shadow:</label>
                              <input
                                type="text"
                                value={imageBoxShadow}
                                onChange={(e) => setImageBoxShadow(e.target.value)}
                                placeholder="e.g., 2px 2px 5px #888888"
                              />

          </div>
          )}
        </div>

      )}
    </div>
  );
};



ImageWidget.modules = {
  toolbar: [
    [{ header: [1, 2, 3,4,5,6,false] }],
    [{ font: [] }], // Font family
    [{ size: [] }], // Font size
    ['bold', 'italic', 'underline', 'strike'],
    [{ script: "sub" }, { script: "super" }],
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

ImageWidget.formats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', "strike", "script",
  'color', 'background', 'list', 'bullet', 'check', 'custom-bullet', 'align', 'indent',
  'blockquote', 'code-block', 'link', 'image',
];

export default ImageWidget;

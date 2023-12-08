export const getTextSelection = (contentState, selection, blockDelimiter) => {
    blockDelimiter = blockDelimiter || '\n';
    var startKey   = selection.getStartKey();
    var endKey     = selection.getEndKey();
    var blocks     = contentState.getBlockMap();

    var lastWasEnd = false;
    var selectedBlock = blocks
        .skipUntil(function(block) {
            return block.getKey() === startKey;
        })
        .takeUntil(function(block) {
            var result = lastWasEnd;

            if (block.getKey() === endKey) {
                lastWasEnd = true;
            }

            return result;
        });

    return selectedBlock
        .map(function(block) {
            var key = block.getKey();
            var text = block.getText();

            var start = 0;
            var end = text.length;

            if (key === startKey) {
                start = selection.getStartOffset();
            }
            if (key === endKey) {
                end = selection.getEndOffset();
            }

            text = text.slice(start, end);
            return text;
        })
        .join(blockDelimiter);
}

export const selectAll = (textbox,contentState) => {
   return textbox.getSelection().merge({
        anchorKey: contentState.getFirstBlock().getKey(),
        anchorOffset: 0,

        focusOffset: contentState.getLastBlock().getText().length,
        focusKey: contentState.getLastBlock().getKey(),
    });
}

export const updateEditorContent = (textbox, selectionState, content,setTextbox,Modifier,EditorState) => {
    const modifiedContent = Modifier.replaceText(
      textbox.getCurrentContent(),
      selectionState,
      content
    );


    const newEditorState = EditorState.push(
      textbox,
      modifiedContent,
      
    );
    setTextbox(newEditorState);
}

import React, { createRef, useEffect } from 'react';

const styles = {
    text: {
        fontSize: '1rem',
        fontWeight: 300,
        margin: 'auto',
    },
}

function evalScripts(node) {
    if (node.tagName === 'SCRIPT') {
        eval(node.innerText);
    }
    node.childNodes.forEach((element) => evalScripts(element));
}

function HtmlItem(props) {
    const ref = createRef();
    useEffect(() => {
        evalScripts(ref.current);
    });
    return (
        <div style={styles.text} ref={ref} dangerouslySetInnerHTML={{ __html: props.option.html }}></div>
    );
}

export default HtmlItem;

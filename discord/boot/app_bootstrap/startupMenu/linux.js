his.handleTouchEndClearValue,onTouchMove:this.handleTouchMove,onTouchStart:this.handleTouchStart,title:t},n)}}},{key:"renderArrow",value:function(){if(this.props.arrowRenderer){var e=this.handleMouseDownOnArrow,t=this.state.isOpen,n=this.props.arrowRenderer({onMouseDown:e,isOpen:t});return n?a.a.createElement("span",{className:"Select-arrow-zone",onMo
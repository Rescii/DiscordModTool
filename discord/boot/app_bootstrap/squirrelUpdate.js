break}e.stopPropagation(),this.selectFocusedOption();break;case 38:e.preventDefault(),this.focusPreviousOption();break;case 40:e.preventDefault(),this.focusNextOption();break;case 33:e.preventDefault(),this.focusPageUpOption();break;case 34:e.preventDefault(),this.focusPageDownOption();break;case 35:if(e.shiftKey)break;e.preventDefault(),this.focusEndOption();break;case 36:if(e.shiftKey)break;e.preventDefault(),this.focusStartOption();break;case 46:!this.state.inputValue&&this.props.deleteRemoves&&(e.preventDefault(),this.popValue())}}},{key:"handleValueClick",value:function(e,t){this.props.onValueClick&&this.props.onValueClick(e,t)}},{key:"handleMenuScroll",value:function(e){if(this.props.onMenuScrollToBottom){var t=e.target;t.scrollHeight>t.offsetHeight&&t.scrollHeight-t.offsetHeight-t.scrollTop<=0&&this.props.onMenuScrollToBottom()}}},{key:"getOptionLabel",value:function(e){return e[this.props.labelKey]}},{key:"getValueArray",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n="object"===(void 0===t?"undefined":k(t))?t:this.props;if(n.multi){if("string"==typeof e&&(e=e.split(n.delimiter)),!Array.isArray(e)){if(null==e)return[];e=[e]}return e.map((function(e){return I(e,n)})).filter((function(e){return e}))}var r=I(e,n);return r?[r]:[]}},{key:"setValue",value:function(e){var t=this;if(this.props.autoBlur&&this.blurInput(),this.props.required){var n=z(e,this.props.multi);this.setState({required:n})}this.props.simpleValue&&e&&(e=this.props.multi?e.map((function(e){return e[t.props.valueKey]})).join(this.props.delimiter):e[this.props.valueKey]),this.props.onChange&&this.props.onChange(e)}},{key:"selectValue",value:function(e){var t=this;this.props.closeOnSelect&&(this.hasScrolledToOption=!1);var n=this.props.onSelectResetsInput?"":this.state.inputValue;this.props.multi?this.setState({focusedIndex:null,inputValue:this.handleInputValueChange(n),isOpen:!this.props.closeOnSelect},(function(){t.getValueArray(t.props.value).some((function(n){return n[t.props.valueKey]===e[t.props.valueKey]}))?t.removeValue(e):t.addValue(e)})):this.setState({inputValue:this.handleInputValueChange(n),isOpen:!this.props.closeOnSelect,isPseudoFocused:this.state.isFocused},(function(){t.setValue(e)}))}},{key:"addValue",value:function(e){var t=this.getValueArray(this.props.value),n=this._visibleOptions.filter((function(e){return!e.disabled})),r=n.indexOf(e);this.setValue(t.concat(e)),this.props.closeOnSelect&&(n.length-1===r?this.focusOption(n[r-1]):n.length>r&&this.focusOption(n[r+1]))}},{key:"popValue",value:function(){var e=this.getValueArray(this.props.value);e.length&&!1!==e[e.length-1].clearableValue&&this.setValue(this.props.multi?e.slice(0,e.length-1):null)}},{key:"removeValue",value:function(e){var t=this,n=this.getValueArray(this.props.value);this.setValue(n.filter((function(n){return n[t.props.valueKey]!==e[t.props.valueKey]}))),this.focus()}},{key:"clearValue",value:function(e){e&&"mousedown"===e.type&&0!==e.button||(e.preventDefault(),this.setValue(this.getResetValue()),this.setState({inputValue:this.handleInputValueChange(""),isOpen:!1},this.focus),this._focusAfterClear=!0)}},{key:"getResetValue",value:function(){return void 0!==this.props.resetValue?this.props.resetValue:this.props.multi?[]:null}},{key:"focusOption",value:function(e){this.setState({focusedOption:e})}},{key:"focusNextOption",value:function(){this.focusAdjacentOption("next")}},{key:"focusPreviousOption",value:function(){this.focusAdjacentOption("previous")}},{key:"focusPageUpOption",value:function(){this.focusAdjacentOption("page_up")}},{key:"focusPageDownOption",value:function(){this.focusAdjacentOption("page_down")}},{key:"focusStartOption",value:function(){this.focusAdjacentOption("start")}},{key:"focusEndOption",value:function(){this.focusAdjacentOption("end")}},{key:"focusAdjacentOption",value:function(e){var t=this._visibleOptions.map((function(e,t){return{option:e,index:t}})).filter((function(e){return!e.option.disabled}));if(this._scrollToFocusedOptionOnUpdate=!0,!this.state.isOpen){var n={focusedOption:this._focusedOption||(t.length?t["next"===e?0:t.length-1].option:null),isOpen:!0};return this.props.onSelectResetsInput&&(n.inputValue=""),void this.setState(n)}if(t.length){for(var r=-1,a=0;a<t.length;a++)if(this._focusedOption===t[a].option){r=a;break}if("next"===e&&-1!==r)r=(r+1)%t.length;else if("previous"===e)r>0?r-=1:r=t.length-1;else if("start"===e)r=0;else if("end"===e)r=t.length-1;else if("page_up"===e){var o=r-this.props.pageSize;r=o<0?0:o}else if("page_down"===e){var l=r+this.props.pageSize;r=l>t.length-1?t.length-1:l}-1===r&&(r=0),this.setState({focusedIndex:t[r].index,focusedOption:t[r].option})}}},{key:"getFocusedOption",value:function(){return this._focusedOption}},{key:"selectFocusedOption",value:function(){if(this._focusedOption)return this.selectValue(this._focusedOption)}},{key:"renderLoading",value:function(){if(this.props.isLoading)return a.a.createElement("span",{className:"Select-loading-zone","aria-hidden":"true"},a.a.createElement("span",{className:"Select-loading"}))}},{key:"renderValue",value:function(e,t){var n=this,r=this.props.valueRenderer||this.getOptionLabel,o=this.props.valueComponent;if(!e.length)return function(e,t,n){var r=e.inputValue,a=e.isPseudoFocused,o=e.isFocused,l=t.onSelectResetsInput;return!r||!l&&!n&&!a&&!o}(this.state,this.props,t)?a.a.createElement("div",{className:"Select-placeholder"},this.props.placeholder):null;var l,i,u,s,c,f,p=this.props.onValueClick?this.handleValueClick:null;return this.props.multi?e.map((function(t,l){return a.a.createElement(o,{disabled:n.props.disabled||!1===t.clearableValue,id:n._instancePrefix+"-value-"+l,instancePrefix:n._instancePrefix,key:"value-"+l+"-"+t[n.props.valueKey],onClick:p,onRemove:n.removeValue,placeholder:n.props.placeholder,value:t,values:e},r(t,l),a.a.createElement("span",{className:"Select-aria-only"}," "))})):(l=this.state,i=this.props,u=l.inputValue,s=l.isPseudoFocused,c=l.isFocused,f=i.onSelectResetsInput,u&&(f||!c&&s||c&&!s)?void 0:(t&&(p=null),a.a.createElement(o,{disabled:this.props.disabled,id:this._instancePrefix+"-value-item",instancePrefix:this._instancePrefix,onClick:p,placeholder:this.props.placeholder,value:e[0]},r(e[0]))))}},{key:"renderInput",value:function(e,t){var n,r=this,o=p()("Select-input",this.props.inputProps.className),l=this.state.isOpen,i=p()((C(n={},this._instancePrefix+"-list",l),C(n,this._instancePrefix+"-backspace-remove-message",this.props.multi&&!this.props.disabled&&this.state.isFocused&&!this.state.inputValue),n)),u=this.state.inputValue;!u||this.props.onSelectResetsInput||this.state.isFocused||(u="");var s=_({},this.props.inputProps,{"aria-activedescendant":l?this._instancePrefix+"-option-"+t:this._instancePrefix+"-value","aria-describedby":this.props["aria-describedby"],"aria-expanded":""+l,"aria-haspopup":""+l,"aria-label":this.props["aria-label"],"aria-labelledby":this.props["aria-labelledby"],"aria-owns":i,onBlur:this.handleInputBlur,onChange:this.handleInputChange,onFocus:this.handleInputFocus,ref:function(e){return r.input=e},role:"combobox",required:this.state.required,tabIndex:this.props.tabIndex,value:u});if(this.props.inputRenderer)return this.props.inputRenderer(s);if(this.props.disabled||!this.props.searchable){var f=F(this.props.inputProps,[]),d=p()(C({},this._instancePrefix+"-list",l));return a.a.createElement("div",_({},f,{"aria-expanded":l,"aria-owns":d,"aria-activedescendant":l?this._instancePrefix+"-option-"+t:this._instancePrefix+"-value","aria-disabled":""+this.props.disabled,"aria-label":this.props["aria-label"],"aria-labelledby":this.props["aria-labelledby"],className:o,onBlur:this.handleInputBlur,onFocus:this.handleInputFocus,ref:function(e){return r.input=e},role:"combobox",style:{border:0,width:1,display:"inline
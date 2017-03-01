import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';

class App extends React.Component {
  render() {
    return ( 
      <Contacts/>
    );
  }  
}
      
class Contacts extends React.Component {
  constructor(props) {
      super(props);
        this.state = {
          data: [
            {name: "Jin", phone: "(408) 543-2342"},
            {name: "Jay", phone: "(213) 432-1134"},
            {name: "Kim", phone: "(206) 342-3421"}
          ],
          selectedKey: -1,
          selected: { name: "", phone: ""}
        };
    }
    
    insertContact(name, phone) {
      let newData = update(this.state, {
        data: {
          $push: [{"name": name, "phone": phone}]
        } 
      });
      this.setState(newData);
    }
                           
    onSelect(key) {
      console.log(key);
      console.log(this.state.selectedKey);
      if (key == this.state.selectedKey) {
        this.setState({
          selectedKey: -1,
          selected: {
            name: "",
            phone: ""
          }
        });
        return;
      }    
      this.setState({
        selectedKey: key,
        selected: this.state.data[key]
      });
      console.log(this.state);
    }
    
    isSelected(key) {
      if (this.state.selectedKey == key) return true;
      return false;
    }
    
    removeContact(key) {
      if (this.state.selectedKey == -1) {
        window.alert("You did not select any.");
        return;
      }
      
      this.setState({
        data: update(this.state, {
          data: {
            $splice: [[this.selectedKey, 1]]
          }
        }),
        selectedKey: -1,
        selected: {
          name: "",
          phone:""
        }
      });
    }
    
    editContact(name, phone) {
      this.setState({
        data: update(this.state.data, 
          { 
            [this.selectedKey]: {
              name: {$set: name},
              phone: {$set: phone}
            } 
          }
        ),
        selected: {
          name: name,
          phone: phone
        }
      });
      
    }
    
    render() {
      return(
        <div>
          <ul>
            {
              this.state.data.map((contact, i) => {
                 return(<ContactInfo name={contact.name} 
                                     phone={contact.phone}
                                     key={i}
                                     contactKey={i}
                                     isSelected={this.isSelected.bind(this)(i)}
                                     onSelect={this.onSelect.bind(this)} />
      
                       );
              })
            }
          </ul>
          <ContactCreator onInsert={this.insertContact.bind(this)} />
          <ContactRemover onRemove={this.removeContact.bind(this)} />
          <ContactEditor onEdit={this.editContact.bind(this)} 
                         contact={this.state.selected}
                         isSelected={this.state.selectedKey != -1} />
        </div>
       );
    }
}

class ContactInfo extends React.Component {
  handleClick() {
    this.props.onSelect(this.props.contactKey);
  }
  
  render() {
      let getStyle = isSelected => {
        if (!isSelected) return;
        let style = {
          fontWeight: 'bold',
          backgroudColor: '#4efcd8' 
        };
        return style;
      };
    return (
      <li style={getStyle(this.props.isSelected)}
          onClick={this.handleClick.bind(this)}>
          {this.props.name}  {this.props.phone}
     </li>
    );
  }
}

class ContactCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      name: "",
      phone: ""
    };
  }
  
  handleClick() {
    this.props.onInsert(this.state.name, this.state.phone);
    this.setState({
      name: "",
      phone: ""
    });
  }
  
  render() {
    return(
      <div>
        <p>
          <input type="text" name="name" placeholder="name" value={this.state.name} />
          <input type="text" name="phone" placeholder="phone" value={this.state.phone} />
          <button onClick={this.handleClick.bind(this)}>INSERT</button>
       </p>
      </div>
    );
  }
}

class ContactRemover extends React.Component {
  handleClick() {
    this.props.onRemove();
  }
  
  render() {
    return(
      <div>
        <button onClick={this.handleClick.bind(this)}>
          REMOVE
        </button>
      </div>
    );
  }
}

class ContactEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: ""
    };
  }
  
  handleClick() {
    if (!this.props.isSelected) return;
    this.props.onEdit(this.state.name, this.state.phone);
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.contact.name,
      phone: nextProps.contact.phone
    });
  }
  
  render() {
     return (
            <div>
                <p>
                    <input type="text"
                        name="name"
                        placeholder="name"
                        value={this.state.name}/>

                    <input type="text"
                        name="phone"
                        placeholder="phone"
                        value={this.state.phone}/>
                    <button onClick={this.handleClick.bind(this)}>
                        Edit
                    </button>
                </p>
            </div>
        );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
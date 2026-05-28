import { Component, State, Prop, h, EventEmitter, Event, Watch } from '@stencil/core';

@Component({
  tag: 'ln-hospspace-editor',
  styleUrl: 'ln-hospspace-editor.css',
  shadow: true,
})
export class LnHospspaceEditor {
  @Prop() opened: boolean = false;
  @Prop() role: string = 'general';
  @Prop() space: any = {}; 
  @Prop() existingPavilions: string[] = [];

  @State() localData: any = {};
  @State() isCreatingNewPavilion: boolean = false;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<void>;
  @Event({ eventName: 'editor-saved' }) editorSaved: EventEmitter<any>;

  @Watch('space')
  watchHandler(newValue: any) {
    this.localData = { ...newValue };
    this.isCreatingNewPavilion = false;
  }

  private handlePavilionChange(e: any) {
    const value = e.target.value;
    if (value === 'NEW_PAVILION') {
      this.isCreatingNewPavilion = true;
      this.localData = { ...this.localData, pavilion: '' }; 
    } else {
      this.isCreatingNewPavilion = false;
      this.localData = { ...this.localData, pavilion: value };
    }
  }

  private handleSave(e: Event) {
    e.preventDefault();
    this.editorSaved.emit(this.localData);
  }

  render() {
    const availableIcons = ['favorite', 'psychology', 'healing', 'login', 'child_care', 'meeting_room', 'medical_services', 'local_hospital'];
    const availableBlocks = ['A', 'B', 'C', 'D', 'E'];

    return (
      <md-dialog 
        open={this.opened} 
        onClose={() => this.editorClosed.emit()}
      >
        <div slot="headline" style={{ marginBottom: '8px' }}>
          {this.localData.id?.includes('temp') ? 'Registrácia nového priestoru' : `Úprava miestnosti ${this.localData.roomNumber}`}
        </div>
        
        <form 
          slot="content" 
          id="edit-form" 
          onSubmit={(e) => this.handleSave(e)} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px', 
            padding: '16px 24px', 
            boxSizing: 'border-box' 
          }}
        >
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <md-outlined-text-field
              style={{ flex: '1' }} label="Číslo miestnosti" required
              value={this.localData.roomNumber}
              onInput={(e: any) => this.localData = { ...this.localData, roomNumber: e.target.value }}
              disabled={this.role === 'veduci'}
            ></md-outlined-text-field>

            <md-outlined-text-field
              style={{ flex: '2' }} label="Názov / Ambulancia" required
              value={this.localData.name}
              onInput={(e: any) => this.localData = { ...this.localData, name: e.target.value }}
            ></md-outlined-text-field>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <md-filled-select 
              label="Pavilón" 
              value={this.isCreatingNewPavilion ? 'NEW_PAVILION' : this.localData.pavilion}
              onInput={(e: any) => this.handlePavilionChange(e)}
              disabled={this.role === 'veduci'}
            >
              <md-icon slot="leading-icon">corporate_fare</md-icon>
              
              {this.existingPavilions.map(p => (
                <md-select-option value={p} selected={this.localData.pavilion === p}>
                  <div slot="headline">{p}</div>
                </md-select-option>
              ))}
              
              <md-select-option value="NEW_PAVILION">
                <div slot="headline" style={{ color: '#1a73e8', fontWeight: 'bold' }}>➕ Vytvoriť nový pavilón...</div>
              </md-select-option>
            </md-filled-select>

            {this.isCreatingNewPavilion && (
              <md-outlined-text-field
                label="Napíšte názov nového pavilónu" required
                value={this.localData.pavilion}
                onInput={(e: any) => this.localData = { ...this.localData, pavilion: e.target.value }}
              >
                <md-icon slot="leading-icon">create_new_folder</md-icon>
              </md-outlined-text-field>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <md-filled-select 
              style={{ flex: '1' }} label="Blok" 
              value={this.localData.block}
              onInput={(e: any) => this.localData = { ...this.localData, block: e.target.value }}
              disabled={this.role === 'veduci'}
            >
              {availableBlocks.map(b => (
                <md-select-option value={b} selected={this.localData.block === b}>
                  <div slot="headline">{b}</div>
                </md-select-option>
              ))}
            </md-filled-select>

            <md-outlined-text-field
              style={{ flex: '1' }} label="Poschodie" type="number"
              value={String(this.localData.floor ?? '')}
              onInput={(e: any) => this.localData = { ...this.localData, floor: parseInt(e.target.value) || 0 }}
              disabled={this.role === 'veduci'}
            ></md-outlined-text-field>

            <md-outlined-text-field
              style={{ flex: '1' }} label="Rozloha (m²)" type="number"
              value={String(this.localData.areaSquareMeters || '')}
              onInput={(e: any) => this.localData = { ...this.localData, areaSquareMeters: parseInt(e.target.value) || 0 }}
              disabled={this.role === 'veduci'}
            ></md-outlined-text-field>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <md-outlined-text-field
              style={{ flex: '1' }} label="Typ priestoru" required
              value={this.localData.type}
              onInput={(e: any) => this.localData = { ...this.localData, type: e.target.value }}
            ></md-outlined-text-field>

            <md-filled-select 
              style={{ flex: '1' }} label="Ikona miestnosti" 
              value={this.localData.icon}
              onInput={(e: any) => this.localData = { ...this.localData, icon: e.target.value }}
            >
              {this.localData.icon && <md-icon slot="leading-icon">{this.localData.icon}</md-icon>}
              {availableIcons.map(ico => (
                <md-select-option value={ico} selected={this.localData.icon === ico}>
                  <md-icon slot="start">{ico}</md-icon>
                  <div slot="headline">{ico}</div>
                </md-select-option>
              ))}
            </md-filled-select>
          </div>

          <md-filled-select 
            label="Stav prevádzky" 
            value={this.localData.status}
            onInput={(e: any) => this.localData = { ...this.localData, status: e.target.value }}
          >
            <md-select-option value="V prevádzke"><div slot="headline">V prevádzke</div></md-select-option>
            <md-select-option value="Prebieha údržba"><div slot="headline">Prebieha údržba</div></md-select-option>
            <md-select-option value="Mimo prevádzky"><div slot="headline">Mimo prevádzky</div></md-select-option>
          </md-filled-select>

        </form>

        <div slot="actions" style={{ marginTop: '8px' }}>
          <md-text-button onClick={() => this.editorClosed.emit()}>Zrušiť</md-text-button>
          <md-filled-button form="edit-form" type="submit">Uložiť záznam</md-filled-button>
        </div>
      </md-dialog>
    );
  }
}

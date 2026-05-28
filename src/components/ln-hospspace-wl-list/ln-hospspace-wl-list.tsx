import { Component, State, Prop, h } from '@stencil/core';

interface HospitalSpace {
  id: string;
  roomNumber: string;
  name: string;
  type: string;
  pavilion: string;
  block: string;
  floor: number;
  areaSquareMeters: number;
  status: string;
  icon: string;
}

@Component({
  tag: 'ln-hospspace-wl-list',
  styleUrl: 'ln-hospspace-wl-list.css',
  shadow: true,
})
export class LnHospspaceWlList {

  @Prop() apiBase: string;
  @Prop() spaceId: string;
  @Prop() role: 'spravca' | 'veduci' | 'general' = 'general';

  @State() spaces: HospitalSpace[] = [];
  @State() spaceToEdit: HospitalSpace | null = null;

  @State() errorMessage: string = '';
  @State() isLoading: boolean = false;
  @State() isEditorOpen: boolean = false;

  async componentWillLoad() {
    this.isLoading = true;
    try {
      this.spaces = await this.getSpacesAsync();
    } catch (e) {
      this.errorMessage = 'Nepodarilo sa načítať dáta.';
    } finally {
      this.isLoading = false;
    }
  }

  private async getSpacesAsync(): Promise<HospitalSpace[]> {
    return Promise.resolve([
      { id: 'space-001', roomNumber: '104', name: 'Kardiologická ambulancia', type: 'Ambulancia', pavilion: 'Pavilón A (Chirurgický)', block: 'A', floor: 1, areaSquareMeters: 25, status: 'V prevádzke', icon: 'favorite' },
      { id: 'space-002', roomNumber: '105', name: 'Neurologická ambulancia', type: 'Ambulancia', pavilion: 'Pavilón A (Chirurgický)', block: 'A', floor: 1, areaSquareMeters: 22, status: 'V prevádzke', icon: 'psychology' },
      { id: 'space-003', roomNumber: '215', name: 'Operačná sála 3', type: 'Chirurgia', pavilion: 'Pavilón A (Chirurgický)', block: 'A', floor: 2, areaSquareMeters: 55, status: 'Prebieha údržba', icon: 'healing' },
      { id: 'space-004', roomNumber: '001', name: 'Centrálny príjem pacientov', type: 'Oddelenie', pavilion: 'Pavilón B (Detský)', block: 'B', floor: 0, areaSquareMeters: 120, status: 'V prevádzke', icon: 'login' },
      { id: 'space-005', roomNumber: '110', name: 'Pediatrická ambulancia', type: 'Ambulancia', pavilion: 'Pavilón B (Detský)', block: 'B', floor: 1, areaSquareMeters: 30, status: 'V prevádzke', icon: 'child_care' }
    ]);
  }

  private openAddDialog() {
    this.spaceToEdit = {
      id: `temp-${Date.now()}`,
      roomNumber: '',
      name: '',
      type: 'Ambulancia',
      pavilion: 'Pavilón A (Chirurgický)',
      block: 'A',
      floor: 1,
      areaSquareMeters: 20,
      status: 'V prevádzke',
      icon: 'meeting_room'
    };
    this.isEditorOpen = true;
  }

  private openEditDialog(id: string) {
    const found = this.spaces.find(s => s.id === id);
    if (!found) return;

    this.spaceToEdit = { ...found };
    this.isEditorOpen = true;
  }

  private handleDeleteSpace(id: string) {
    if (confirm('Naozaj chcete vymazať tento priestor?')) {
      this.spaces = this.spaces.filter(s => s.id !== id);
    }
  }

  private handleSave(ev: CustomEvent<HospitalSpace>) {
    const saved = ev.detail;

    const exists = this.spaces.some(s => s.id === saved.id);

    if (exists) {
      this.spaces = this.spaces.map(s => s.id === saved.id ? saved : s);
    } else {
      this.spaces = [...this.spaces, saved];
    }

    this.isEditorOpen = false;
  }

  private getPavilionColor(pavilionName: string): string {
    const colors: Record<string, string> = {
      'Pavilón A (Chirurgický)': '#1a73e8',
      'Pavilón B (Detský)': '#34a853',
      'Pavilón C (Infekčný)': '#ea4335',
    };
    return colors[pavilionName] || '#9aa0a6';
  }

  private getGroupedSpaces() {
    const grouped: Record<string, Record<number, HospitalSpace[]>> = {};

    this.spaces.forEach(space => {
      if (!grouped[space.pavilion]) {
        grouped[space.pavilion] = {};
      }
      if (!grouped[space.pavilion][space.floor]) {
        grouped[space.pavilion][space.floor] = [];
      }
      grouped[space.pavilion][space.floor].push(space);
    });

    return grouped;
  }

  private getUniquePavilions(): string[] {
    return [...new Set(this.spaces.map(s => s.pavilion))];
  }

render() {
  const groupedSpaces = this.getGroupedSpaces();

  return (
    <div class="spaces-wrapper" style={{ padding: '24px', fontFamily: 'var(--md-sys-typescale-body-large-font, sans-serif)' }}>
      
      {this.errorMessage && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          {this.errorMessage}
        </div>
      )}

      {this.isLoading && (
        <div style={{ marginBottom: '16px' }}>
          Načítavam dáta...
        </div>
      )}

      <div class="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: '0' }}>Správa priestorov nemocnice</h1>
        
        {this.role === 'spravca' && (
          <md-filled-button onClick={() => this.openAddDialog()}>
            <md-icon slot="icon">add</md-icon>
            Pridať novú miestnosť
          </md-filled-button>
        )}
      </div>

      {Object.keys(groupedSpaces).map(pavilion => (
        <div
          class="pavilion-card"
          style={{
            marginBottom: '32px',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            backgroundColor: `${this.getPavilionColor(pavilion)}15`,
            overflow: 'hidden'
          }}
        >
          <div style={{
            backgroundColor: this.getPavilionColor(pavilion),
            padding: '16px 24px',
            color: '#ffffff',
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px'
          }}>
            <md-icon style={{ '--md-icon-size': '28px' }}>corporate_fare</md-icon>
            <h2 style={{ margin: '0' }}>{pavilion}</h2>
          </div>

          {Object.keys(groupedSpaces[pavilion]).map(floor => {
            const floorNum = parseInt(floor);
            const floorLabel = floorNum === 0 ? 'Prízemie' : `${floorNum}. poschodie`;
            
            return (
              <div class="floor-group" style={{ marginLeft: '16px', marginRight: '16px', marginBottom: '20px' }}>
                <h3 style={{ margin: '12px 0', color: '#5f6368', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <md-icon style={{ '--md-icon-size': '20px' }}>layers</md-icon>
                  {floorLabel}
                </h3>

                <md-list style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  {groupedSpaces[pavilion][floorNum].map((space, index, arr) => (
                    <div key={space.id}>
                      <md-list-item>
                        <md-icon slot="start">{space.icon}</md-icon>

                        <div slot="headline">
                          <strong>Miestnosť {space.roomNumber}</strong> – {space.name}
                        </div>

                        <div slot="supporting-text">
                          Typ: {space.type} | Blok: {space.block} | Rozloha: {space.areaSquareMeters} m² | Stav: {space.status}
                        </div>

                        <div slot="end" style={{ display: 'flex', gap: '8px' }}>
                          
                          {this.role === 'veduci' && (
                            <md-icon-button onClick={() => this.openEditDialog(space.id)}>
                              <md-icon>edit</md-icon>
                            </md-icon-button>
                          )}

                          {this.role === 'spravca' && (
                            <md-icon-button 
                              onClick={() => this.handleDeleteSpace(space.id)}
                              style={{ '--md-icon-button-icon-color': '#ea4335' }}
                            >
                              <md-icon>delete</md-icon>
                            </md-icon-button>
                          )}

                        </div>
                      </md-list-item>

                      {index < arr.length - 1 && <md-divider></md-divider>}
                    </div>
                  ))}
                </md-list>
              </div>
            );
          })}
        </div>
      ))}

      <ln-hospspace-editor
        opened={this.isEditorOpen}
        space={this.spaceToEdit}
        role={this.role}
        existingPavilions={this.getUniquePavilions()}
        onEditor-closed={() => this.isEditorOpen = false} 
        onEditor-saved={(ev) => this.handleSave(ev as any)}      
      />
    </div>
  );
}
}
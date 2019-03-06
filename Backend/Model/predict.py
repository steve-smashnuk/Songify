import sys
import json
import numpy
import torch

from utils.util import get_instance
import model.model as module_model
from data_loader.dataset import MidiDataset

class Predict:
    MAX_LEN = 1000
    def __init__(self, data_path='./data/out.pkl', resume='./weights/Music_LSTM_big/0304_041925/model_best.pth'):
        self.data_path = data_path
        self.dataset = MidiDataset(self.data_path)
        self.resume = resume

        # Load checkpoint
        if torch.cuda.is_available():
            checkpoint = torch.load(self.resume)
        else:
            checkpoint = torch.load(self.resume, map_location=lambda storage, loc: storage)
        state_dict = checkpoint['state_dict']
        self.config = checkpoint['config']

        # Load model
        self.model = get_instance(module_model, 'model', self.config)
        self.model.load_state_dict(state_dict)
        self.model.eval()


    def seqGenerateOutput(self, input, extra=None):
        pred_output = []

        output = self.model(input, extra=extra)

        for i, chord in enumerate(output['chord_out']):
            c_idx = int(torch.argmax(chord))
            chordstr = self.dataset.convert_chord_to_onehot(c_idx)
            if i == 0:
                # make up for input by attaching the same chord
                for j in range(self.dataset.SEQUENCE_LENGTH):
                    pred_output.append(chordstr)
            else:
                pred_output.append(chordstr)

        return pred_output

    def generateOutput(self, input, extra=None):
        pred_output = []
        output = self.model(input, extra=extra)

        output_chords = output['chord_out'].squeeze()

        for i, chord in enumerate(output_chords):
            c_idx = int(torch.argmax(chord))
            chordstr = self.dataset.convert_chord_int_to_str(c_idx)
            pred_output.append(chordstr)

        return pred_output

    def seq_process(self, input_):
        notes = [self.dataset.convert_note_to_int(n) for n in input_]
        x = []
        lengths = []

        for i in range(len(input_) - self.dataset.SEQUENCE_LENGTH + 1):
            curr_x = notes[i:i + self.dataset.SEQUENCE_LENGTH]
            x.append(curr_x)
            lengths.append(len(curr_x))

        # convert to torch tensor
        x = torch.LongTensor(x)
        seq_lengths = torch.LongTensor(lengths)

        # store in output
        input = {'melody_x':x}
        extra = {'seq_lengths': seq_lengths}
        return input, extra

    def process(self, input_):
        x = [self.dataset.convert_note_to_int(n) for n in input_]
        seq_lengths = [len(x)]

        # convert to torch tensor
        x = torch.LongTensor(x).unsqueeze(0)
        seq_lengths = torch.LongTensor(seq_lengths)

        # store in output
        input = {'melody_x':x}
        extra = {'seq_lengths': seq_lengths}
        return input, extra

    def get_prediction(self, input_):
        x, extra = self.process(input_)
        return self.generateOutput(x, extra=extra)

if __name__ == "__main__":
    predict = Predict()
    input = ['A','A','A','A','A','A','C','C','C','C','C','C','C','C','C','C','A','A','B','B','B','B','B','A']
    # inputs = [input, input]
    output = predict.get_prediction(input)
    print(input)
    print(output)

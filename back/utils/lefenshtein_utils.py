import numpy as np

def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    s1_len = len(s1)
    s2_len = len(s2)
    distances = np.arange(s2_len + 1)
    for i1, c1 in enumerate(s1):
        distances_ = [i1 + 1]
        for i2, c2 in enumerate(s2):
            if c1 == c2:
                distances_.append(distances[i2])
            else:
                distances_.append(min((distances[i2], distances[i2 + 1], distances_[-1])) + 1)
        distances = distances_
    return distances[-1]
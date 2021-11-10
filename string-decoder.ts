/* # Decode an encoded string 

# GIven an encoded string of the format “n[encoded_string]” where n is a positive integer number, print out the decoded string which is encoded_string repeated n times


# Example:

# “3[a]” → “aaa”
# “2[a]3[bc]” ---> “aabcbcbc” 
# “2[a3[c]]” ---> “acccaccc”
*/

const decodePart = (input: string, decoded: string = ''): string => {
  // this is a recursive function that uses a regexp to extract 
  // the parameters of the decoding logic from the given input string
  const execRes = (/(\w*)(\d+)\[(.*)\](\w*)/gm).exec(input);
  if (!execRes) {
    return input;
  }
  
  const [fullMatch, prefix, nStr, ptrn, postfix] = execRes;
  let pattern = ptrn;
   
  
  if (pattern.indexOf('[') >= 0) {
    // the pattern to be repeated has nested parenthesis, let's decode that separately
    pattern = decodePart(pattern, decoded);    
  }
  
  decoded += prefix;
  for (let i = 1; i <= +nStr; i++) {
    decoded += pattern;
  }
  
  decoded += postfix;
  
  return decoded;
}

const decode = (input: string): string => {
  // this first level decoding function splits the encoded text into individual parts
  // and decodes the parts one by one 
  // eg.: a2[d]3[c] is considered having two parts: a2[d] and 3[c] 
  // the limitation of the RegExp in decodePart needs this splitting logic
  
  const parts: string[] = [];
  let openParentheses = 0;
  let startPartIdx = 0;
  
  input.split('').forEach((char, idx) => {
    if (char === '[') {
      openParentheses++;
    } else if (char === ']') {
      openParentheses--;
      if (openParentheses === 0) {
        parts.push(input.slice(startPartIdx, idx + 1));
        startPartIdx = idx + 1;
      }
    }
  });
  
  if (startPartIdx !== input.length) {
    parts.push(input.slice(startPartIdx, input.length));
  }
  
  return parts.map(part => decodePart(part)).join('');
}

const test = (encoded: string, expected: string) => {
  const decoded = decode(encoded);
  if (expected == decoded) {
    console.log(`${encoded} - OK (got ${decoded})`);
  } else {
    console.warn(`${encoded} - NOK (got ${decoded})`)
  }
}

test('3[a]', 'aaa');
test('2[a]3[bc]', 'aabcbcbc')
test('z2[a]3[bc]z', 'zaabcbcbcz')
test('2[a3[c]]', 'acccaccc');
test('a2[a3[c]]d', 'aacccacccd');

/*
Time Complexity:
  - O(n) for splitting the encoded string, where n is the length of the encoded string 
  - O(m + 1) for decoding the parts, where m is the number of open brackets in the encoded string 
             the +1 is the worst case when the encoded string does not end with a closing bracket
  - SUM: O(n) + O(m + 1)
*/

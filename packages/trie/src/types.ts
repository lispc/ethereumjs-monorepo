import { BranchNode, ExtensionNode, LeafNode } from './trie'
import { WalkController } from './util/walkController'

export type TrieNode = BranchNode | ExtensionNode | LeafNode

export type Nibbles = number[]

// Branch and extension nodes might store
// hash to next node, or embed it if its len < 32
export type EmbeddedNode = Buffer | Buffer[]

export type Proof = Buffer[]

export type FoundNodeFunction = (
  nodeRef: Buffer,
  node: TrieNode | null,
  key: Nibbles,
  walkController: WalkController
) => void

export type HashFunc = (msg: Uint8Array) => Uint8Array

export interface TrieOpts {
  /**
   * A database instance.
   */
  db?: DB
  /**
   * A `Buffer` for the root of a previously stored trie
   */
  root?: Buffer
  /**
   * Delete nodes from DB on delete operations (disallows switching to an older state root)
   * Default: `false`
   */
  deleteFromDB?: boolean

  /**
   * Hash function used for hashing trie node and securing key.
   */
  hash?: HashFunc
}

export type BatchDBOp = PutBatch | DelBatch

export interface PutBatch {
  type: 'put'
  key: Buffer
  value: Buffer
}

export interface DelBatch {
  type: 'del'
  key: Buffer
}

export interface DB {
  /**
   * Retrieves a raw value from leveldb.
   * @param key
   * @returns A Promise that resolves to `Buffer` if a value is found or `null` if no value is found.
   */
  get(key: Buffer): Promise<Buffer | null>

  /**
   * Writes a value directly to leveldb.
   * @param key The key as a `Buffer`
   * @param value The value to be stored
   */
  put(key: Buffer, val: Buffer): Promise<void>

  /**
   * Removes a raw value in the underlying leveldb.
   * @param keys
   */
  del(key: Buffer): Promise<void>

  /**
   * Performs a batch operation on db.
   * @param opStack A stack of levelup operations
   */
  batch(opStack: BatchDBOp[]): Promise<void>

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying leveldb instance.
   */
  copy(): DB
}

export type Checkpoint = {
  // We cannot use a Buffer => Buffer map directly. If you create two Buffers with the same internal value,
  // then when setting a value on the Map, it actually creates two indices.
  keyValueMap: Map<string, Buffer | null>
  root: Buffer
}
